/**
 * Why `unibox-api` refused something an agent can do something about.
 *
 * Sent as `error.details.reason`. An inbox shown in Georgian cannot print the API's English sentence at the agent, so
 * each of these is a key `unibox-web` translates. The English `message` remains for a log line and for anything that
 * does not know this list.
 */
export enum UniboxRefusal {
    /** The conversation's channel has been switched off, so a reply has nowhere to go. */
    CHANNEL_INACTIVE = 'channel-inactive',
    /** The conversation cannot move to that status from where it is now. Carries `currentStatus` and `requestedStatus`. */
    STATUS_NOT_ALLOWED = 'status-not-allowed',
    /** A conversation is snoozed until a moment that has to be in the future. */
    SNOOZE_IN_PAST = 'snooze-in-past',
    /** Another canned reply already uses that shortcut. */
    SHORTCUT_TAKEN = 'shortcut-taken',
    /** Another team already has that name. */
    TEAM_NAME_TAKEN = 'team-name-taken',
    /** Another channel already has that key. */
    CHANNEL_KEY_TAKEN = 'channel-key-taken',
    /** Too many replies in one conversation at once. Carries `retryAfterSeconds`. */
    SEND_RATE_LIMITED = 'send-rate-limited',
    /** Too many requests at once. Carries `retryAfterSeconds`. */
    RATE_LIMITED = 'rate-limited',
    /** Conduit would not take the reply, which is the channel's connection or operation, not the reply itself. */
    DISPATCH_REFUSED = 'dispatch-refused',
    /** Conduit could not be reached, so the reply was not handed over. Trying again may work. */
    DISPATCH_UNAVAILABLE = 'dispatch-unavailable',
}
