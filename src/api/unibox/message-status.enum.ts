/**
 * How far an **outbound** message got.
 *
 * Inbound and internal messages are always {@link MessageStatus.RECEIVED} and
 * {@link MessageStatus.NONE} respectively — the states below describe our side of a send, and a
 * message that arrived has no send to describe.
 *
 * The three post-send states mirror what the messaging platforms report back through their status
 * webhooks, and they arrive **through the inbound pipeline** (§11): a provider telling us a
 * message was read is just another webhook. Nothing polls for them.
 */
export enum MessageStatus {
    /** Not applicable — an internal note. */
    NONE = 'none',

    /** Inbound. It is here; there was nothing to send. */
    RECEIVED = 'received',

    /**
     * Written down and handed to Conduit, which answered `202`.
     *
     * The important state to read correctly: it means Conduit has accepted responsibility, not
     * that the provider has seen it. An inbox that renders this as a delivered tick is lying at
     * exactly the moment a provider outage matters.
     */
    QUEUED = 'queued',

    /** The provider accepted it. */
    SENT = 'sent',

    /** The provider says it reached the contact's device. */
    DELIVERED = 'delivered',

    /** The contact opened it. Not every platform reports this. */
    READ = 'read',

    /**
     * It will not be sent. Terminal.
     *
     * Set when Conduit dead-letters the dispatch, or when the send is refused outright — an
     * inactive channel, a closed messaging window. `failureReason` carries the why, because
     * "failed" alone sends an agent to ask an engineer.
     */
    FAILED = 'failed',
}
