/** What a moderator decided about a case. */
export enum SocialCaseDecision {
    /** Nothing was wrong. */
    DISMISS = 'dismiss',
    /** The content comes down and the member is told why. */
    REMOVE = 'remove',
    /** The content comes down and it goes on the member's record as a warning. */
    WARN = 'warn',
    /** The content comes down and the member cannot use Ezo until a date. */
    SUSPEND = 'suspend',
    /** The content comes down and the member cannot use Ezo at all. */
    BAN = 'ban',
}
