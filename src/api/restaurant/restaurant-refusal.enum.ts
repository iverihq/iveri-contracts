/**
 * A restaurant refusal a person can act on, sent as `details.reason` so a client says it in the reader's language rather
 * than showing the API's English. A diner meets the ordering and booking ones; staff meet the bill, kitchen and set-up
 * ones as well.
 */
export enum RestaurantRefusal {
    /** A dish is off the menu or cannot be ordered right now; `details.itemId` names it. */
    DISH_UNAVAILABLE = 'dish-unavailable',
    /** The branch is not taking orders of that kind (eaten in, taken away, delivered, or from the table). */
    CHANNEL_CLOSED = 'channel-closed',
    /** This restaurant cannot take money online, so the order has to be paid at the restaurant. */
    ONLINE_PAYMENT_UNAVAILABLE = 'online-payment-unavailable',
    /** Paying at the restaurant needs an account; a guest pays online. */
    SIGN_IN_TO_PAY = 'sign-in-to-pay',
    /** A delivery is below the branch's minimum; `details.shortOfMinimumMinor` says by how much. */
    BELOW_DELIVERY_MINIMUM = 'below-delivery-minimum',
    /** The branch is closed now, so an order has to be for a later time. */
    CLOSED_NOW = 'closed-now',
    /** That time is too soon to be ready or too far ahead. */
    TIME_UNAVAILABLE = 'time-unavailable',
    /** The branch is closed at the time chosen. */
    CLOSED_AT_TIME = 'closed-at-time',
    /** The address is further than the branch delivers. */
    OUT_OF_DELIVERY_RANGE = 'out-of-delivery-range',
    /** The branch has stopped trading, so nothing can be ordered or booked there. */
    BRANCH_CLOSED = 'branch-closed',
    /** The order can no longer be paid for: it is paid, cancelled or past paying online. */
    ORDER_NOT_PAYABLE = 'order-not-payable',
    /** The payment page could not be opened; trying again may work. */
    PAYMENT_PAGE_FAILED = 'payment-page-failed',
    /** An order is reviewed once it has reached the diner. */
    REVIEW_TOO_EARLY = 'review-too-early',
    /** The order has already been reviewed. */
    ALREADY_REVIEWED = 'already-reviewed',
    /** The branch does not take bookings. */
    BOOKINGS_OFF = 'bookings-off',
    /** A party that size is arranged by phone. */
    PARTY_TOO_LARGE = 'party-too-large',
    /** That time cannot be booked. */
    BOOKING_TIME_UNAVAILABLE = 'booking-time-unavailable',
    /** Somebody else has the table, or one of the tables, at that time. */
    TABLE_TAKEN = 'table-taken',
    /** No single table seats the party, so staff choose tables to push together. */
    NO_TABLE_FITS = 'no-table-fits',
    /** The booking is seated, completed, cancelled or a no-show, so it can no longer be changed. */
    BOOKING_FINISHED = 'booking-finished',
    /** The booking cannot make that move from where it is now, usually because somebody else moved it first. */
    BOOKING_MOVED_ON = 'booking-moved-on',
    /** The order is completed or cancelled. */
    ORDER_FINISHED = 'order-finished',
    /** The order cannot make that move from where it is now, usually because somebody else moved it first. */
    ORDER_MOVED_ON = 'order-moved-on',
    /** The kitchen can only change plates on an order that is in the kitchen or ready. */
    NOT_IN_KITCHEN = 'not-in-kitchen',
    /** The bill is settled or cancelled. */
    BILL_CLOSED = 'bill-closed',
    /** More than is owing on the bill; `details.balanceMinor` says what is. */
    MORE_THAN_OWING = 'more-than-owing',
    /** More than is left of the payment to give back; `details.refundableMinor` says what is. */
    REFUND_EXCEEDS_PAYMENT = 'refund-exceeds-payment',
    /** The bill still has orders to finish. */
    BILL_ORDERS_OPEN = 'bill-orders-open',
    /** The bill still has money owing. */
    BILL_MONEY_OWING = 'bill-money-owing',
    /** The restaurant's public address changes only while it is unpublished. */
    UNPUBLISH_FIRST = 'unpublish-first',
    /** The restaurant's profile has not been set up, so nothing can be ordered yet. */
    SETUP_INCOMPLETE = 'setup-incomplete',
}
