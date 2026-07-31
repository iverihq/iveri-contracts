/**
 * Every action a principal can be granted in an Iveri tenant, across every service.
 *
 * A permission is a **contract**, not an implementation detail: `iveri-identity-api` stores
 * members on role rows and resolves them into access tokens, every other service reads them
 * out of that token to authorize a request, and the frontend's `<RequirePermission>` branches
 * on the same values. A member's wire value therefore never changes, and a member is never
 * removed while issued tokens can still carry it — removing one silently downgrades every
 * live session holding it. Adding one is a minor version.
 *
 * **One catalogue for the whole platform, deliberately.** Identity validates custom-role input
 * against this list, so a permission it has never heard of cannot be granted. A service that
 * defined its own enum locally would find its permissions unassignable.
 *
 * Values are `<resource>:<action>` — or `<service>:<resource>:<action>` where a resource name
 * would otherwise collide across services — lowercase, so a token payload is readable in a
 * log and a wildcard match (`role:*`) stays possible if we ever need one.
 */
export enum UserPermission {
    // ══ iveri-identity-api ═══════════════════════════════════════════════════

    // ── Tenant ──────────────────────────────────────────────────────────────
    TENANT_READ = 'tenant:read',
    TENANT_UPDATE = 'tenant:update',
    /** Schedules the tenant for deletion. Owner-only; there is no undo path built yet. */
    TENANT_DELETE = 'tenant:delete',

    // ── User ────────────────────────────────────────────────────────────────
    USER_READ = 'user:read',
    USER_INVITE = 'user:invite',
    USER_UPDATE = 'user:update',
    USER_REMOVE = 'user:remove',

    // ── Membership ──────────────────────────────────────────────────────────
    MEMBERSHIP_READ = 'membership:read',
    /** Suspend or reactivate someone's access without deleting their account. */
    MEMBERSHIP_UPDATE = 'membership:update',
    /**
     * Change which roles a membership holds. Separate from `MEMBERSHIP_UPDATE` because
     * granting roles is privilege escalation and deserves its own gate.
     */
    MEMBERSHIP_ASSIGN_ROLE = 'membership:assign-role',

    // ── Role ────────────────────────────────────────────────────────────────
    ROLE_READ = 'role:read',
    ROLE_CREATE = 'role:create',
    ROLE_UPDATE = 'role:update',
    ROLE_DELETE = 'role:delete',

    // ── API key ─────────────────────────────────────────────────────────────
    API_KEY_READ = 'api-key:read',
    API_KEY_ISSUE = 'api-key:issue',
    API_KEY_REVOKE = 'api-key:revoke',

    // ══ conduit-api ══════════════════════════════════════════════════════════

    // ── Endpoint ────────────────────────────────────────────────────────────
    /** Read endpoint configuration. Never exposes the signing secret. */
    CONDUIT_ENDPOINT_READ = 'conduit:endpoint:read',
    CONDUIT_ENDPOINT_CREATE = 'conduit:endpoint:create',
    CONDUIT_ENDPOINT_UPDATE = 'conduit:endpoint:update',
    CONDUIT_ENDPOINT_DELETE = 'conduit:endpoint:delete',

    // ── Capture ─────────────────────────────────────────────────────────────
    /**
     * List and read captured requests, **including their raw bodies and headers**. Captures
     * hold whatever a provider sent — order details, message contents, personal data — so
     * this is closer to a data-export permission than a config one.
     */
    CONDUIT_CAPTURE_READ = 'conduit:capture:read',
    CONDUIT_CAPTURE_DELETE = 'conduit:capture:delete',

    // ── Replay ──────────────────────────────────────────────────────────────
    /**
     * Resend a captured request to an arbitrary URL. Separate from `CONDUIT_CAPTURE_READ`
     * because it makes an outbound request from our infrastructure with a body the caller
     * controls, which is a materially different power from reading a row.
     */
    CONDUIT_REPLAY_EXECUTE = 'conduit:replay:execute',

    // ── Provider ────────────────────────────────────────────────────────────
    CONDUIT_PROVIDER_READ = 'conduit:provider:read',
    /** Define or amend a custom provider manifest — signature scheme, headers, handshake. */
    CONDUIT_PROVIDER_MANAGE = 'conduit:provider:manage',
}

/**
 * Every member, for seeding the owner role and validating custom-role input.
 *
 * Frozen because it is shared mutable state in a browser bundle otherwise: one caller sorting
 * it in place reorders it for everyone.
 */
export const ALL_USER_PERMISSIONS: readonly UserPermission[] = Object.freeze(Object.values(UserPermission));
