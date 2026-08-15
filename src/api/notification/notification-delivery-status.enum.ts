/**
 * How far one channel's attempt at a notification got.
 *
 * The state lives on the **delivery**, never on the notification. A notification that fans out to
 * email and the in-app inbox has two independent fates, and a single rolled-up status would have
 * to pick one of them to report — which means either hiding a dead letter behind a success or
 * marking a wholly delivered notification as failed because one channel bounced.
 *
 * These mirror `conduit-api`'s outbound states deliberately but are a **separate enum**, for the
 * same reason Conduit keeps its inbound and outbound statuses apart: the words coincide and the
 * stories do not. A dead-lettered dispatch means a customer's message never reached a provider; a
 * dead-lettered notification means a person was never told something we decided to tell them.
 */
export enum NotificationDeliveryStatus {
    /** Waiting for its next attempt, due at `nextAttemptAt`. */
    PENDING = 'pending',

    /**
     * Claimed by a worker and in progress.
     *
     * A row stranded here past the claim timeout is reclaimed by the same query that claims fresh
     * work, which is where at-least-once becomes visible and why every channel adapter has to
     * tolerate being asked twice.
     */
    IN_FLIGHT = 'in-flight',

    /**
     * The channel accepted it. Terminal, and the strongest thing we can honestly say.
     *
     * **There is no `DELIVERED`**, and its absence is a decision rather than an omission. An SMTP
     * relay accepting a message is not evidence a person received it — the bounce arrives minutes
     * later, out of band, and nothing here is listening for one yet. A `DELIVERED` state we cannot
     * observe would be a field every UI renders as a green tick and no code ever sets.
     */
    SENT = 'sent',

    /**
     * The attempt budget is spent, or the channel refused in a way no retry can fix. Terminal.
     *
     * Reached from a permanent refusal on the very first attempt — an address the relay rejects
     * outright, a template that names a message key nobody has published — because four more
     * identical failures buy nothing and delay the moment somebody can act.
     */
    DEAD_LETTERED = 'dead-lettered',

    /** An operator stopped it before it went out. Terminal, and not a failure. */
    CANCELLED = 'cancelled',
}
