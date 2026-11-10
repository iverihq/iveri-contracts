/** Why the door said no. The screen names it, because a person is standing there. */
export enum GymCheckInRefusal {
    INVALID_CODE = 'invalid-code',
    NO_MEMBERSHIP = 'no-membership',
    AWAITING_PAYMENT = 'awaiting-payment',
    NOT_STARTED = 'not-started',
    EXPIRED = 'expired',
    FROZEN = 'frozen',
    NO_VISITS_LEFT = 'no-visits-left',
    OUTSIDE_HOURS = 'outside-hours',
    WRONG_BRANCH = 'wrong-branch',
}
