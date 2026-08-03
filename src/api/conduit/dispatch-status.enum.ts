/**
 * Where one outbound dispatch is in its life.
 *
 * The members mirror `DeliveryStatus` exactly, and this is deliberately **not** the same enum.
 * The two are separate wire contracts on separate resources, and sharing one would mean a state
 * added for the inbound queue silently appears on the outbound one's documented API — a
 * connector-specific state has no business showing up on a webhook delivery, and vice versa.
 * Being identical today is not a reason to make them the same type; it is just what happens when
 * two queues share a state machine.
 *
 * There is no `RATE_LIMITED` member on purpose. A dispatch held back by a connector's rate limit
 * is simply `PENDING` with a later `nextAttemptAt`, because that is exactly what it is — waiting
 * for its next attempt time, no differently from one waiting out a backoff. A separate state
 * would suggest an operator has something to do about it.
 */
export enum DispatchStatus {
    /** Waiting for its next attempt time. The only state the processor claims from. */
    PENDING = 'pending',

    /**
     * Claimed by a replica and being attempted right now.
     *
     * A row stuck here past the claim timeout is assumed abandoned and reclaimed — and on this
     * side that reclaim is genuinely dangerous, because the request may have already reached the
     * provider. It is why every dispatch carries an idempotency key onward and why a caller must
     * treat outbound as at-least-once too.
     */
    IN_FLIGHT = 'in-flight',

    /** The provider accepted it. Terminal. */
    DELIVERED = 'delivered',

    /**
     * Every attempt was used and none succeeded, or the failure was permanent. Terminal until an
     * operator redrives it.
     *
     * **This is the dead-letter queue** — a status, not a separate resource.
     */
    DEAD_LETTERED = 'dead-lettered',

    /** An operator stopped it before it was sent. Terminal, and distinct from a failure. */
    CANCELLED = 'cancelled',
}
