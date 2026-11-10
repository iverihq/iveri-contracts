/** How a leave type's yearly allowance arrives. */
export enum HrLeaveAccrual {
    /** All of it on the first day of the year. */
    UPFRONT = 'upfront',
    /** A twelfth each month. */
    MONTHLY = 'monthly',
}
