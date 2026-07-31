/**
 * Stable, machine-readable error classification carried in every
 * {@link ApiErrorResponse}.
 *
 * A code is a **contract**: clients branch on it, so a member's meaning never
 * changes and a member is never removed once published. Adding one is a minor
 * version; repurposing one is a breaking change.
 *
 * Codes are deliberately coarser than HTTP status. Two different 404s that a
 * client must handle differently deserve two codes; two that it handles
 * identically share one.
 */
export enum ErrorCode {
    // ── 400 Bad Request ─────────────────────────────────────────────────────
    /** Request body or query failed DTO validation. `details` lists the fields. */
    VALIDATION_FAILED = 'VALIDATION_FAILED',
    /** Body could not be parsed at all — bad JSON, wrong content type. */
    MALFORMED_REQUEST = 'MALFORMED_REQUEST',

    // ── 401 Unauthorized ────────────────────────────────────────────────────
    /** No credentials presented, or the token could not be verified. */
    UNAUTHENTICATED = 'UNAUTHENTICATED',
    /** Credentials were well-formed but wrong. Never distinguishes unknown user from bad password. */
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    /** Token parsed and verified, but its expiry has passed. The client should refresh and retry. */
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',

    // ── 403 Forbidden ───────────────────────────────────────────────────────
    /** Authenticated, but the action is not permitted for this principal. */
    FORBIDDEN = 'FORBIDDEN',
    /** Authenticated, but the principal's role lacks the required permission. */
    INSUFFICIENT_PERMISSION = 'INSUFFICIENT_PERMISSION',
    /** The resource belongs to another tenant. Emitted instead of leaking its existence. */
    TENANT_MISMATCH = 'TENANT_MISMATCH',

    // ── 404 Not Found ───────────────────────────────────────────────────────
    RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',

    // ── 409 Conflict ────────────────────────────────────────────────────────
    /** The request contradicts current state — a stale version, a closed aggregate. */
    RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
    /** A uniqueness constraint would be violated. */
    RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',

    // ── 413 / 422 ───────────────────────────────────────────────────────────
    PAYLOAD_TOO_LARGE = 'PAYLOAD_TOO_LARGE',
    /** Syntactically valid and well-formed, but rejected by a business rule. */
    UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',

    // ── 429 Too Many Requests ───────────────────────────────────────────────
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

    // ── 5xx ─────────────────────────────────────────────────────────────────
    /** Catch-all for an unhandled failure. Details are logged, never returned. */
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    /** A third-party or downstream service returned an error we could not recover from. */
    EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
    /** A dependency is unreachable or the service is shutting down. Retryable. */
    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
    /** A downstream call exceeded its deadline. Retryable. */
    DEPENDENCY_TIMEOUT = 'DEPENDENCY_TIMEOUT',
}
