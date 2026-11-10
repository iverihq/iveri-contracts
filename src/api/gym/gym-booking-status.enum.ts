export enum GymBookingStatus {
    CONFIRMED = 'confirmed',
    WAITLISTED = 'waitlisted',
    ATTENDED = 'attended',
    NO_SHOW = 'no-show',
    CANCELLED = 'cancelled',
    /** Cancelled after the cut-off, so what it cost is not returned. */
    LATE_CANCELLED = 'late-cancelled',
}
