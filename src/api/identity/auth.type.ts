import type { UserPermission } from '../../enum/user-permission.enum.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { MembershipStatus } from './membership-status.enum.js';
import type { TenantStatus } from './tenant-status.enum.js';

/** `POST /auth/signup` — creates a tenant and its first owner in one call. */
export interface SignupBody {
    tenantName: string;

    /** Login identifier for the tenant. Globally unique and permanent. */
    tenantSlug: string;

    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

/** `POST /auth/login`. */
export interface LoginBody {
    /**
     * Users are tenant-scoped — `(tenantId, email)` is what is unique, not the email — so a
     * login cannot be resolved without knowing the tenant. That is the decision that lets
     * `BaseRepository` scope every table with no exceptions; the slug on this body is its
     * visible cost.
     */
    tenantSlug: string;

    email: string;
    password: string;
}

/** `POST /auth/refresh` and `POST /auth/logout`. */
export interface RefreshTokenBody {
    refreshToken: string;
}

/** `POST /auth/accept-invitation` — the invitee sets a password and the membership activates. */
export interface AcceptInvitationBody {
    invitationToken: string;
    password: string;
}

/** Returned by `POST /auth/refresh`, and nested inside {@link AuthSession}. */
export interface AuthTokens {
    /** Send as `Authorization: Bearer <accessToken>`. */
    accessToken: string;

    /**
     * Opaque. Rotated on every refresh — the previous value stops working immediately, and
     * presenting a spent one is treated as a leak and revokes every token for that user.
     *
     * A client therefore needs a **single-flight guard** around refresh: four honest concurrent
     * requests reacting to one expired access token would send the same refresh token four
     * times, and three of those are replays. `conduit-admin-web/src/lib/auth` has the reference
     * implementation; any new frontend needs it on day one, not after the first logout bug.
     */
    refreshToken: string;

    /** Lifetime of `accessToken` in seconds, not of `refreshToken`. */
    expiresInSeconds: number;
}

/**
 * Returned by `POST /auth/token` — the API-key-for-JWT exchange a service makes so that other
 * Iveri services can authorize it **without calling identity**.
 *
 * **There is deliberately no refresh token.** The API key already is the long-lived credential,
 * and it is revocable by a row. A refresh token here would be a second long-lived credential
 * with its own independent lifetime, rotation rule and leak story, obtained from the first —
 * so revoking the key would no longer be enough to stop the caller. A service re-exchanges
 * instead, which costs one call per {@link expiresInSeconds}.
 *
 * The key travels as `x-api-key`, so this call has no request body.
 */
export interface ServiceToken {
    /** Send as `Authorization: Bearer <accessToken>`. Carries `pt: 'service'`. */
    accessToken: string;

    /**
     * Lifetime in seconds. Shorter than a human session's: a service re-exchanges with nobody
     * waiting, so the revocation window is cheap to shrink.
     */
    expiresInSeconds: number;
}

/**
 * Who the caller is. Returned by `GET /auth/me` and nested inside {@link AuthSession}.
 *
 * The user fields are nullable because a machine principal — an API key — has permissions and
 * a tenant but no person behind it. A client rendering this must handle that.
 *
 * `permissions` is a **snapshot resolved when the access token was issued**, not a live read.
 * Access tokens are stateless JWTs carrying their permissions precisely so a service like
 * `conduit-api` can authorize locally without calling identity on the hot path; the price is
 * that a permission revoked elsewhere stays effective until the token expires. Do not "fix"
 * that with a database read in a guard.
 */
export interface Principal {
    /** Null for an API-key principal. */
    userId: Nullable<UUID>;

    email: Nullable<string>;
    firstName: Nullable<string>;
    lastName: Nullable<string>;

    tenantId: UUID;
    tenantName: string;
    tenantSlug: string;
    tenantStatus: TenantStatus;

    /** Null for an API-key principal. */
    membershipStatus: Nullable<MembershipStatus>;

    roleSlugs: string[];

    /** What this credential can do right now, as of token issue. */
    permissions: UserPermission[];
}

/**
 * Returned by signup, login and invitation acceptance.
 *
 * Tokens and principal together, so a client does not have to follow every login with a call
 * to `/auth/me` before it can render anything.
 */
export interface AuthSession {
    principal: Principal;
    tokens: AuthTokens;
}
