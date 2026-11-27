/**
 * A Commerce refusal a person can act on, sent as `details.reason` so a client says it in the reader's language rather
 * than showing the API's English.
 *
 * Two audiences read these. The first six reach a shopper through `commerce-storefront-api`, which passes on the reason
 * and nothing else; the rest are the merchant's, in the panel. **A detail named here is the merchant's**: the shopfront
 * never forwards one, because `out-of-stock`'s `quantityAvailable` is exactly the number a shop must not publish.
 */
export enum CommerceRefusal {
    /** Not enough stock for a line; `details.quantityAvailable` says how many could be sold (merchant only). */
    OUT_OF_STOCK = 'out-of-stock',
    /** The product, or the chosen variant of it, is no longer sold. */
    NOT_FOR_SALE = 'not-for-sale',
    /** The lines are priced in different currencies, so they cannot be one order. */
    MIXED_CURRENCY = 'mixed-currency',
    /** The order is paid, or called off, so there is nothing to pay now. */
    NOT_AWAITING_PAYMENT = 'not-awaiting-payment',
    /** The order has moved on or been paid for, so the shopper can no longer call it off. */
    NOT_CANCELLABLE = 'not-cancellable',
    /** The shopper's saved list holds as many products as it can; `details.limit` says how many. */
    SAVED_FULL = 'saved-full',
    /** Another product or category already has that web address. */
    SLUG_TAKEN = 'slug-taken',
    /** Another product or variant already has that SKU. */
    SKU_TAKEN = 'sku-taken',
    /** The product already has a variant with exactly these options. */
    VARIANT_OPTIONS_TAKEN = 'variant-options-taken',
    /** A product keeps at least one variant; archive the product instead. */
    LAST_VARIANT = 'last-variant',
    /** The adjustment would leave less stock than open orders hold; `details.quantityReserved` says how much they hold. */
    STOCK_BELOW_RESERVED = 'stock-below-reserved',
    /** A product holds at most `details.limit` images. */
    IMAGE_LIMIT = 'image-limit',
    /** Only a confirmed order can be prepared for shipping. */
    ORDER_NOT_CONFIRMED = 'order-not-confirmed',
    /** The order already has a shipment. */
    FULFILLMENT_EXISTS = 'fulfillment-exists',
    /** A courier collects only a packed shipment. */
    NOT_PACKED = 'not-packed',
    /** This shop is not set up to send couriers. */
    COURIERS_OFF = 'couriers-off',
}
