import type { UserPermission } from '../../enum/user-permission.enum.js';
import type { UUID } from '../../type/uuid.type.js';

import type { PrincipalType } from './principal-type.enum.js';

/**
 * Claims carried by an access token.
 *
 * **`iveri-identity-api` issues these; every other service only verifies them.** The shape is
 * therefore a contract owned by identity, and it lives here rather than in either repo because
 * both sides have to agree byte for byte — a service whose idea of these claims has drifted
 * does not fail loudly, it rejects every request or, worse, reads the wrong field and keeps
 * going. `conduit-api` carried a hand-copied duplicate of this interface until the `pt` claim
 * had to be added to both at once, which is exactly the drift the copy invited.
 *
 * Names are short and non-obvious (`tid`, `perms`) because this is JWT convention and because
 * the token travels on every request — the registered claims are three characters for the same
 * reason.
 *
 * **Permissions are embedded rather than resolved per request.** That is the whole point of a
 * JWT here: any Iveri service verifies a token with the shared secret and never calls identity
 * on the hot path. The cost is staleness — revoking a role does not invalidate access tokens
 * already issued, so a removed permission survives up to identity's `JWT_ACCESS_TOKEN_TTL`
 * (15 minutes by default), or `JWT_SERVICE_TOKEN_TTL` for a service token. Anything needing
 * immediate revocation must check state at the point of use, not rely on the token.
 */
export interface AccessTokenPayload {
    /**
     * Subject — **the principal**, which is a user id or an API key id depending on {@link pt}.
     *
     * Read it together with `pt` or not at all. Treating it as a user id unconditionally is the
     * one mistake this shape is arranged to prevent.
     */
    sub: UUID;

    /**
     * Which kind of principal `sub` names.
     *
     * Required, so adding the service-token path could not silently leave a consumer reading a
     * machine's `sub` as a person's id.
     */
    pt: PrincipalType;

    /** Tenant the token is scoped to. Becomes `RequestContext.tenantId`; never trusted from a header. */
    tid: UUID;

    /** Permissions resolved from the principal's roles — or from the API key's grant — at issue time. */
    perms: UserPermission[];

    /** Issued-at, seconds since epoch. Set by the signer. */
    iat?: number;

    /** Expiry, seconds since epoch. Set by the signer. */
    exp?: number;

    /** Issuer, verified on every decode so a token from another Iveri environment is rejected. */
    iss?: string;

    /** Audience, verified alongside `iss`. */
    aud?: string;
}
