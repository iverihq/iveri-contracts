/** Why a leave balance moved. A balance is the sum of these and is never stored. */
export enum HrLeaveLedgerKind {
    ALLOWANCE = 'allowance',
    ACCRUAL = 'accrual',
    CARRY_OVER = 'carry-over',
    ADJUSTMENT = 'adjustment',
    TAKEN = 'taken',
    RETURNED = 'returned',
}
