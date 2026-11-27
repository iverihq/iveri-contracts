/**
 * A clinic refusal a person can act on, sent as `details.reason` so a client says it in the reader's language rather than
 * showing the API's English.
 */
export enum ClinicRefusal {
    /** Somebody else holds that time, or the specialist, room or machine is no longer free. */
    TIME_TAKEN = 'time-taken',
    /** The visit is checked in, finished or cancelled, so it can no longer be moved. */
    NOT_BOOKED = 'not-booked',
    /** Too close to another session of the same treatment; `details.minDaysBetweenSessions` says how far apart. */
    SESSION_GAP = 'session-gap',
    /** The chosen specialist does not perform this treatment at this branch. */
    SPECIALIST_INELIGIBLE = 'specialist-ineligible',
}
