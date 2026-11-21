/** A refusal a person can act on, sent as `details.reason` so a client translates it rather than showing this API's English. */
export enum ChatRefusal {
    BLOCKED = 'blocked',
    NOT_WRITABLE = 'not-writable',
    CLOSED = 'closed',
    EDIT_WINDOW_PASSED = 'edit-window-passed',
    DELETE_WINDOW_PASSED = 'delete-window-passed',
    NOT_A_PARTICIPANT = 'not-a-participant',
    GROUP_FULL = 'group-full',
    HANDLE_TAKEN = 'handle-taken',
    NETWORK_ONLY = 'network-only',
    NO_PROFILE = 'no-profile',
    PIN_LIMIT = 'pin-limit',
    /** The conversation already holds as many pinned messages as it takes. */
    MESSAGE_PIN_LIMIT = 'message-pin-limit',
    /** Only the group's owners and admins write here. */
    ADMINS_ONLY = 'admins-only',
    LAST_OWNER = 'last-owner',
    INVITATION_EXPIRED = 'invitation-expired',
    SUSPENDED = 'suspended',
    ATTACHMENT_REFUSED = 'attachment-refused',
    REQUEST_PENDING = 'request-pending',
    /** This conversation takes no calls: a product's conversation that does not allow them, or an app's. */
    CALLS_OFF = 'calls-off',
    /** The call has ended, or this person is not in it. */
    CALL_UNAVAILABLE = 'call-unavailable',
    /** A group call already has as many people in it as it takes. */
    CALL_FULL = 'call-full',
    /**
     * The app's plan does not allow it this month: a new user over the monthly-active-user limit, or a message over the
     * message limit. The value is `USAGE_LIMIT_REACHED_REASON` from `@iveri/contracts/billing`, and the details name the
     * metric and the limit.
     */
    USAGE_LIMIT = 'usage-limit-reached',
}
