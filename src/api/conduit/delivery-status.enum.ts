/**
 * Where one delivery is in its life.
 *
 * The states a processor can be interrupted in matter as much as the ones it ends in, which is
 * why `IN_FLIGHT` is a status rather than an implied one: a replica killed mid-attempt leaves
 * rows in it, and the reclaim query needs something to look for.
 */
export enum DeliveryStatus {
    /** Waiting for its next attempt time. The only state the processor claims from. */
    PENDING = 'pending',

    /**
     * Claimed by a replica and being attempted right now.
     *
     * A row stuck here past the claim timeout is assumed abandoned and reclaimed. That reclaim
     * is where at-least-once becomes visible — a replica that died *after* the receiver
     * processed the request will have its work redone, which is what the idempotency key is
     * for.
     */
    IN_FLIGHT = 'in-flight',

    /** The destination answered 2xx. Terminal. */
    DELIVERED = 'delivered',

    /**
     * Every attempt was used and none succeeded, or the failure was permanent. Terminal until an
     * operator redrives it.
     *
     * **This is the dead-letter queue** — a status, not a separate resource. A DLQ that lives
     * somewhere else is a DLQ nobody looks at.
     */
    DEAD_LETTERED = 'dead-lettered',

    /**
     * An operator stopped it before it succeeded. Terminal.
     *
     * Distinct from `DEAD_LETTERED`: dead-lettered means the gateway tried and failed, cancelled
     * means someone decided it should not be sent. Collapsing them makes "how reliable is our
     * delivery" unanswerable.
     */
    CANCELLED = 'cancelled',
}
