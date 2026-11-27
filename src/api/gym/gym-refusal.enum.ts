/**
 * A gym refusal a person can act on, sent as `details.reason` so a client says it in the reader's language rather than
 * showing the API's English. Booking a place and the door keep their own enums, `GymBookingRefusal` and
 * `GymCheckInRefusal`; these are the rest, and no value is shared with either.
 */
export enum GymRefusal {
    /** The trainer has time off then. */
    TRAINER_AWAY = 'trainer-away',
    /** Outside the trainer's working hours. */
    TRAINER_NOT_WORKING = 'trainer-not-working',
    /** The trainer does not take personal sessions booked by members. */
    TRAINER_NO_PERSONAL = 'trainer-no-personal',
    /** The trainer or the room already has a session at that time. */
    TIME_TAKEN = 'time-taken',
    /** The trainer does not work at that branch. */
    TRAINER_OTHER_BRANCH = 'trainer-other-branch',
    /** The session has started, so it, or a place in it, can no longer be given up. */
    SESSION_STARTED = 'session-started',
    /** A session cannot be made smaller than the people already booked; `details.bookedCount` says how many. */
    CAPACITY_BELOW_BOOKED = 'capacity-below-booked',
    /** The trainer already has time off overlapping those days. */
    TIME_OFF_OVERLAP = 'time-off-overlap',
    /** The plan is no longer sold. */
    PLAN_OFF_SALE = 'plan-off-sale',
    /** The member already has that plan on those days. */
    PLAN_OVERLAP = 'plan-overlap',
    /** The member cannot freeze this membership themselves; the desk can. */
    FREEZE_AT_DESK = 'freeze-at-desk',
    /** Only a current or upcoming membership can be frozen. */
    FREEZE_NOT_CURRENT = 'freeze-not-current',
    /** More days than the membership has left to freeze; `details.freezeDaysLeft` says how many it has. */
    FREEZE_DAYS_EXCEEDED = 'freeze-days-exceeded',
    /** Those days overlap another freeze or a renewal already paid for. */
    FREEZE_OVERLAP = 'freeze-overlap',
    /** More than is left of the payment to give back. */
    REFUND_EXCEEDS_PAYMENT = 'refund-exceeds-payment',
    /** The branch is closed, so nobody is let in there. */
    BRANCH_CLOSED = 'branch-closed',
    /** The same code was scanned a moment ago. */
    JUST_SCANNED = 'just-scanned',
    /** The promo code cannot be used. Which rule refused it is not said: a code is not an oracle for its limits. */
    PROMO_INVALID = 'promo-invalid',
    /** The member already has an app account, so there is nothing to invite. */
    MEMBER_HAS_ACCOUNT = 'member-has-account',
    /** This account already belongs to a member of this gym. */
    ALREADY_A_MEMBER = 'already-a-member',
    /** The email confirmation link is too old; a new one is sent from the account. */
    LINK_EXPIRED = 'link-expired',
    /** The member has already signed this version of the waiver. */
    WAIVER_SIGNED = 'waiver-signed',
}
