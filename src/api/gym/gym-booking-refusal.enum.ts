/** Why somebody cannot have a place. Sent as `details.reason` so a client can say it in the member's language. */
export enum GymBookingRefusal {
    NO_MEMBERSHIP = 'no-membership',
    /**
     * A membership that would cover the class is frozen that day. Said instead of `no-membership` or
     * `no-class-access`, which would send somebody who holds the right plan to buy another.
     */
    FROZEN = 'frozen',
    NO_CLASS_ACCESS = 'no-class-access',
    NO_CREDITS = 'no-credits',
    WRONG_BRANCH = 'wrong-branch',
    ALREADY_BOOKED = 'already-booked',
    BOOKING_CLOSED = 'booking-closed',
    TOO_FAR_AHEAD = 'too-far-ahead',
    BOOKING_LIMIT = 'booking-limit',
    NO_SHOW_BLOCKED = 'no-show-blocked',
    SESSION_CANCELLED = 'session-cancelled',
    FULL = 'full',
}
