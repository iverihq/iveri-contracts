/**
 * Why `social-api` refused something a member can do something about.
 *
 * Sent as `error.details.reason`. A site that shows Georgian to a Georgian reader cannot print the
 * API's English sentence at them, so each of these is a key the site translates. The English
 * `message` remains for a log line and for anything that does not know this list.
 */
export enum SocialRefusal {
    PROFILE_MISSING = 'profile-missing',
    PROFILE_EXISTS = 'profile-exists',
    HANDLE_TAKEN = 'handle-taken',
    HANDLE_RESERVED = 'handle-reserved',
    HANDLE_CHANGED_RECENTLY = 'handle-changed-recently',
    TOO_YOUNG = 'too-young',
    TERMS_OUTDATED = 'terms-outdated',
    SUSPENDED = 'suspended',
    BANNED = 'banned',
    DELETING = 'deleting',
    RATE_LIMITED = 'rate-limited',
    IMAGE_UNREADABLE = 'image-unreadable',
    IMAGE_TOO_LARGE = 'image-too-large',
    MEDIA_UNAVAILABLE = 'media-unavailable',
    POST_EMPTY = 'post-empty',
    COMMENTS_DISABLED = 'comments-disabled',
    CANNOT_FOLLOW_SELF = 'cannot-follow-self',
    CANNOT_MESSAGE = 'cannot-message',
    /** Messages are held by Baasi, which this deployment cannot reach or is not configured for. */
    MESSAGING_UNAVAILABLE = 'messaging-unavailable',
    ALREADY_REPORTED = 'already-reported',
    ALREADY_APPEALED = 'already-appealed',
    APPEAL_NOT_ALLOWED = 'appeal-not-allowed',
    EXPORT_TOO_SOON = 'export-too-soon',
    EMAIL_RESEND_TOO_SOON = 'email-resend-too-soon',
    CONFIRMATION_INVALID = 'confirmation-invalid',
    CASE_CLAIMED = 'case-claimed',
    CASE_RESOLVED = 'case-resolved',
    APPEAL_OWN_DECISION = 'appeal-own-decision',
}
