/**
 * How far an order has got.
 *
 * `awaiting-payment` keeps an order paying online away from the kitchen until the money is verified.
 * `placed` waits for a person to accept it. Payment is a separate fact, because cancelled and paid
 * has to be expressible.
 */
export enum RestaurantOrderStatus {
    AWAITING_PAYMENT = 'awaiting-payment',
    PLACED = 'placed',
    IN_KITCHEN = 'in-kitchen',
    READY = 'ready',
    OUT_FOR_DELIVERY = 'out-for-delivery',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}
