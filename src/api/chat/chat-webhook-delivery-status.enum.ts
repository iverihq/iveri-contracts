/**
 * Where one webhook delivery is. The same states Conduit's outbound queue has, under Baasi's own name, so a console
 * never imports Conduit's contract to read its own app's log.
 */
export enum ChatWebhookDeliveryStatus {
    PENDING = 'pending',
    IN_FLIGHT = 'in-flight',
    DELIVERED = 'delivered',
    /** Every attempt failed. It can be sent again from the console. */
    DEAD_LETTERED = 'dead-lettered',
    CANCELLED = 'cancelled',
}
