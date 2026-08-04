/**
 * Where one conversation is in an agent's working day.
 *
 * These are **workflow** states, not delivery states — nothing here says whether a message
 * reached anyone. `MessageStatus` answers that, and conflating the two is how an inbox ends up
 * showing a conversation as "failed".
 *
 * There is deliberately no `ARCHIVED`. Closing is already the "I am done with this" state, and a
 * second one just moves the question of which list a conversation belongs in from the filter to
 * the operator.
 */
export enum ConversationStatus {
    /** Needs a human. The default for anything with an unanswered inbound message. */
    OPEN = 'open',

    /**
     * Answered, waiting on the contact.
     *
     * Distinct from `OPEN` because an inbox sorted only by "has unread" hides the conversations
     * an agent is actually running. A new inbound message moves this back to `OPEN`.
     */
    PENDING = 'pending',

    /**
     * Deliberately out of sight until `snoozedUntil`.
     *
     * The only status carrying a time. It exists because "I will deal with this on Monday" is
     * otherwise expressed by closing something that is not finished, and a closed conversation is
     * one nobody looks at again.
     */
    SNOOZED = 'snoozed',

    /**
     * Finished. Reopened automatically by a new inbound message.
     *
     * That automatic reopen is the important half: a contact replying to a closed conversation is
     * continuing it, and starting a second thread would split one person's history across two
     * rows for no reason a customer would recognise.
     */
    CLOSED = 'closed',
}
