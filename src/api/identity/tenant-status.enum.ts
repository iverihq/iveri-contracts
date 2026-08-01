/**
 * Lifecycle state of a tenant.
 *
 * Every authenticated request checks it, so a suspended tenant loses access without any of its
 * data being touched.
 *
 * Lives here rather than in `iveri-identity-api` because it is on the wire: it rides inside
 * every principal, which means every service and every frontend reads it. `conduit-admin-web`
 * hand-transcribed it as `'active' | 'suspended' | 'cancelled'` — wrong casing and a member
 * identity has never had — and nothing caught it, because a hand-written mirror of an enum is
 * checked by nobody. That is the whole argument for this directory.
 */
export enum TenantStatus {
    /** Normal operation. */
    ACTIVE = 'ACTIVE',

    /**
     * Access blocked — non-payment, abuse, or a customer request. Reversible, and nothing is
     * deleted. Logins fail and existing access tokens stop working at the next request.
     */
    SUSPENDED = 'SUSPENDED',

    /**
     * Scheduled for erasure. Behaves like `SUSPENDED` for access purposes; the distinction is
     * that the data is on its way out, which matters for a GDPR deletion request having a
     * documented, auditable state rather than a row silently vanishing.
     */
    PENDING_DELETION = 'PENDING_DELETION',
}
