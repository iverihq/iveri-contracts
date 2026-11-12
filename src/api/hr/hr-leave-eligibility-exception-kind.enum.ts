/** What HR said about when one person may take one kind of leave, against the type's waiting period. */
export enum HrLeaveEligibilityExceptionKind {
    /** From a date before the waiting period ends, or from the first day when no date is given. */
    ALLOW_EARLY = 'allow-early',
    /** Not before a date later than the waiting period ends. */
    HOLD_BACK = 'hold-back',
    /** Back to the type's own waiting period. */
    FOLLOW_RULE = 'follow-rule',
}
