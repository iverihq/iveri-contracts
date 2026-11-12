/**
 * Where a delivery job stands. `delivery-api` owns the lifecycle; this is its wire vocabulary, so a company's panel and
 * Iveri's backoffice can label a job without restating it.
 */
export enum DeliveryJobStatus {
    /** Priced and waiting for the sender to accept it. */
    QUOTED = 'quoted',
    /** Confirmed, and looking for a courier. */
    DISPATCHING = 'dispatching',
    /** A courier accepted and is on the way to the pickup. */
    COURIER_ASSIGNED = 'courier-assigned',
    /** The courier has the parcel. */
    PICKED_UP = 'picked-up',
    /** The parcel is on its way to the drop-off. */
    IN_TRANSIT = 'in-transit',
    /** Handed over, with the recipient's name and a photograph as proof. */
    DELIVERED = 'delivered',
    /** The sender never accepted the quote before it ran out. */
    QUOTE_EXPIRED = 'quote-expired',
    /** Mobility found no courier. */
    EXPIRED = 'expired',
    /** Mobility refused the request outright; the job never reached a courier. */
    FAILED = 'failed',
    CANCELLED = 'cancelled',
}
