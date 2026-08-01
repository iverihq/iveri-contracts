/**
 * A user's standing inside their tenant.
 *
 * Lives on the membership rather than the user because it is a statement about access, not
 * about identity — and keeping the two apart is what stops "deactivate this person" and
 * "delete this account" from becoming the same operation.
 */
export enum MembershipStatus {
    /** Invited but has not set a password yet. Cannot authenticate. */
    INVITED = 'INVITED',

    /** Normal operation. */
    ACTIVE = 'ACTIVE',

    /** Access revoked without deleting anything. Reversible; existing sessions stop working. */
    SUSPENDED = 'SUSPENDED',
}
