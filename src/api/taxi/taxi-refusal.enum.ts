/**
 * A taxi refusal a person can act on, sent as `details.reason` so a passenger's or a driver's app says it in the
 * reader's language rather than showing the API's English. A company whose licence has lapsed is refused with the
 * platform's own `licence-inactive`, which is not repeated here.
 */
export enum TaxiRefusal {
    /** The fare was not accepted in time, so the ride has to be requested again. */
    QUOTE_EXPIRED = 'quote-expired',
    /** The driver is on the way or the ride has ended, so it can no longer be cancelled. */
    NOT_CANCELLABLE = 'not-cancellable',
    /** The ride has already moved past that step, or ended; refreshing shows where it stands. */
    RIDE_MOVED_ON = 'ride-moved-on',
    /** The ride was given to another driver, or was never this driver's. */
    NOT_ASSIGNED_DRIVER = 'not-assigned-driver',
    /**
     * A ride booked ahead falls outside the window the company takes bookings for; `details.minLeadMinutes` and
     * `details.maxDays` say what it is.
     */
    SCHEDULE_WINDOW = 'schedule-window',
    /** The passenger already keeps as many saved places as there is room for; `details.limit` says how many. */
    PLACES_FULL = 'places-full',
    /** The passenger already has a saved place with that name. */
    PLACE_NAME_TAKEN = 'place-name-taken',
}
