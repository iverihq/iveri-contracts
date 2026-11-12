/** How often a leave type's allowance arrives. */
export enum HrLeaveAllowancePeriod {
    /** As the type's accrual says: all at once on 1 January, or a twelfth a month. */
    YEAR = 'year',
    /** A quarter of the year's allowance at the start of each quarter, and nothing carried into the next. */
    QUARTER = 'quarter',
}
