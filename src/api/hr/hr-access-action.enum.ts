/** What somebody did with pay or identity numbers, as written to the access log. */
export enum HrAccessAction {
    READ_SENSITIVE = 'read-sensitive',
    CHANGE_SENSITIVE = 'change-sensitive',
    READ_PAY = 'read-pay',
    CHANGE_PAY = 'change-pay',
}
