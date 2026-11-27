/**
 * An HR refusal a person can act on, sent as `details.reason` so a client says it in the reader's language rather than
 * showing the API's English. A number a sentence needs travels beside it in `details`, named on the member. A refusal
 * nobody meets through a client, such as a malformed body, has no member and keeps its English.
 */
export enum HrRefusal {
    // Time off and plans

    /** There is already time off, waiting or agreed, on some of those days. */
    TIME_OFF_OVERLAP = 'time-off-overlap',
    /** That kind of time off is no longer offered. */
    LEAVE_TYPE_RETIRED = 'leave-type-retired',
    /** It starts too soon; `details.minNoticeDays` says how much notice it needs. */
    NOTICE_TOO_SHORT = 'notice-too-short',
    /** The waiting period for that kind of time off has not ended; `details.availableFrom` is the first day it may start. */
    LEAVE_NOT_YET = 'leave-not-yet',
    /** Not enough days are left in the year for it. */
    NOT_ENOUGH_DAYS = 'not-enough-days',
    /** Not enough days are left in that quarter for it. */
    NOT_ENOUGH_DAYS_IN_QUARTER = 'not-enough-days-in-quarter',
    /** None of the days asked for is a working day. */
    NO_WORKING_DAYS = 'no-working-days',
    /** The days fall before the person's first day or after their last. */
    OUTSIDE_EMPLOYMENT = 'outside-employment',
    /** The time off has started, so only HR can change it. */
    LEAVE_STARTED = 'leave-started',
    /** The request can no longer be cancelled. */
    NOT_CANCELLABLE = 'not-cancellable',
    /** Somebody has already decided it: a request, a correction, a letter or a probation. */
    ALREADY_DECIDED = 'already-decided',
    /** The person has left the company. */
    PERSON_LEFT = 'person-left',
    /** Some of those days are already in a plan. */
    PLAN_OVERLAP = 'plan-overlap',
    /** That day has already gone. */
    DAY_PASSED = 'day-passed',

    // Office and home days

    /** That day is not a working day. */
    NOT_A_WORKING_DAY = 'not-a-working-day',
    /** Time off already covers that day. */
    TIME_OFF_THAT_DAY = 'time-off-that-day',
    /** The week already has as many home days as the company allows; `details.homeDaysPerWeek` says how many. */
    HOME_DAY_LIMIT = 'home-day-limit',
    /** Too far ahead; `details.maxDaysAhead` says how far a day may be. */
    TOO_FAR_AHEAD = 'too-far-ahead',

    // Hours

    /** The person is not clocked in. */
    NOT_CLOCKED_IN = 'not-clocked-in',
    /** An earlier shift was never clocked out of, so that one is corrected first. */
    OPEN_SHIFT = 'open-shift',
    /** The shift overlaps another one. */
    SHIFT_OVERLAP = 'shift-overlap',
    /** The shift is longer than a shift may be; `details.maxHours` says how long. */
    SHIFT_TOO_LONG = 'shift-too-long',
    /** The shift ends in the future. */
    SHIFT_IN_FUTURE = 'shift-in-future',
    /** That shift already has a correction waiting. */
    CORRECTION_PENDING = 'correction-pending',

    // Stand-ins

    /** Somebody already stands in for the person on some of those days. */
    STAND_IN_OVERLAP = 'stand-in-overlap',
    /** The person decides nobody's requests, so there is nothing to hand over. */
    NOTHING_TO_HAND_OVER = 'nothing-to-hand-over',
    /** Longer than a stand-in may last; `details.maxDays` says how long. */
    STAND_IN_TOO_LONG = 'stand-in-too-long',

    // Expenses

    /** A claim is sent with its receipt. */
    RECEIPT_REQUIRED = 'receipt-required',
    /** Somebody else decides a person's own claim. */
    OWN_CLAIM = 'own-claim',
    /** A pay run has taken the claim; it is removed from the run first. */
    CLAIM_IN_PAY_RUN = 'claim-in-pay-run',
    /** That expense category can no longer be claimed for. */
    CATEGORY_RETIRED = 'category-retired',
    /** Only a draft can be thrown away. */
    NOT_A_DRAFT = 'not-a-draft',

    // Growth, surveys, policies and referrals

    /** It has already been handed in: a review or a survey's answers. */
    ALREADY_ANSWERED = 'already-answered',
    /** It is not open for answers: a review round or a survey. */
    NOT_OPEN = 'not-open',
    /** A review is handed in with an overall rating. */
    RATING_REQUIRED = 'rating-required',
    /** Every question is answered before it is handed in. */
    ANSWERS_REQUIRED = 'answers-required',
    /** The course ends in a certificate, which is attached. */
    CERTIFICATE_REQUIRED = 'certificate-required',
    /** The person already works on as many goals as they may; `details.maxGoals` says how many. */
    GOAL_LIMIT = 'goal-limit',
    /** The goal is finished; it is reopened before it changes. */
    GOAL_FINISHED = 'goal-finished',
    /** The meeting has already happened. */
    MEETING_HAPPENED = 'meeting-happened',
    /** The policy changed since it was opened, so it is read again. */
    POLICY_CHANGED = 'policy-changed',
    /** Nobody puts themselves forward; they apply through the careers page. */
    SELF_REFERRAL = 'self-referral',
    /** The role is not taking applications. */
    OPENING_CLOSED = 'opening-closed',

    // The company's own records

    /** The company's licence covers no more people; `details.seats` says how many it covers. */
    LICENCE_SEATS = 'licence-seats',
    /** Something of that kind already has that name: a department, a location, a team or a job title. */
    NAME_TAKEN = 'name-taken',
    /** Something of that kind already has that code: a kind of time off or an expense category. */
    CODE_TAKEN = 'code-taken',
    /** Somebody here already has that work email. */
    WORK_EMAIL_TAKEN = 'work-email-taken',
    /** The person already has a sign-in. */
    HAS_SIGN_IN = 'has-sign-in',
    /** People still report to this person; who they move to is said first. */
    REPORTS_REMAIN = 'reports-remain',
    /** Somebody has the item, so it is taken back first. */
    EQUIPMENT_HELD = 'equipment-held',
    /** There is already a pay run for that month. */
    PAY_RUN_EXISTS = 'pay-run-exists',
    /** The pay run has been approved, so it no longer changes. */
    PAY_RUN_APPROVED = 'pay-run-approved',
}
