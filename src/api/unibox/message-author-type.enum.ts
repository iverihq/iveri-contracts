/**
 * Who produced a message.
 *
 * `AI` is a member here even though `unibox-ai` is build-order step 9 and does not exist. That is
 * not speculation — it is the field an agent taking over mid-conversation reads to know what the
 * customer has already been told, and §12 makes human handoff a launch requirement rather than a
 * v2 feature. Adding the member later would mean every message written before it was added is
 * indistinguishable from a human's, retroactively and unfixably.
 */
export enum MessageAuthorType {
    /** The person on the other end. `authorUserId` is null. */
    CONTACT = 'contact',

    /** A human agent. `authorUserId` names them. */
    AGENT = 'agent',

    /**
     * The AI agent. Reserved for `unibox-ai`; nothing writes it yet.
     *
     * Distinct from `AGENT` because "did a person say this?" is the question a human asks before
     * taking over, and because a customer who later asks whether they were talking to a bot
     * deserves an answer the data can actually give.
     */
    AI = 'ai',

    /** Unibox itself — assignment changes, status changes. Always `INTERNAL`. */
    SYSTEM = 'system',
}
