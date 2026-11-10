/**
 * Whether a member can use Ezo.
 *
 * `deleting` is the grace period after somebody asks to leave: the account is already invisible to
 * everyone else, and signing in during it cancels the request.
 */
export enum SocialMemberStatus {
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
    BANNED = 'banned',
    DELETING = 'deleting',
}
