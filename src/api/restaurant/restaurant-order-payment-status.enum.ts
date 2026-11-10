/**
 * Whether money is owed to a provider for this order. A fact of its own, beside the order's status,
 * because cancelled and paid has to be expressible.
 */
export enum RestaurantOrderPaymentStatus {
    /** Eaten in, or paid at the restaurant. Nothing is waiting on a provider. */
    NOT_REQUIRED = 'not-required',
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    EXPIRED = 'expired',
}
