/**
 * Where a taxi ride stands. `taxi-api` owns the lifecycle; this is its wire vocabulary, so a company's panel and
 * Iveri's backoffice can label a ride without restating it.
 */
export enum TaxiRideStatus {
    /** Priced and waiting for the passenger to accept the fare. */
    QUOTED = 'quoted',
    /** Confirmed, and looking for a driver (or booked ahead and waiting to look). */
    DISPATCHING = 'dispatching',
    /** A driver accepted. */
    DRIVER_ASSIGNED = 'driver-assigned',
    /** The driver is on their way to the pickup. */
    DRIVER_ARRIVING = 'driver-arriving',
    /** The passenger is in the car. */
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    /** Nobody took it before the quote or the search ran out of time. */
    EXPIRED = 'expired',
}
