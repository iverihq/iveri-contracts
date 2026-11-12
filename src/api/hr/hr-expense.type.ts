import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrExpenseClaimStatus } from './hr-expense-claim-status.enum.js';
import type { HrExpensePaidVia } from './hr-expense-paid-via.enum.js';
import type { HrResourceStatus } from './hr-resource-status.enum.js';
import type { LocalizedText } from './localized-text.type.js';

export interface HrExpenseCategory {
    id: UUID;
    code: string;
    name: LocalizedText;
    sortOrder: number;
    status: HrResourceStatus;
}

export interface HrExpenseClaim {
    id: UUID;
    employeeId: UUID;
    employeeName: string;
    departmentName: Nullable<string>;
    categoryId: UUID;
    categoryName: LocalizedText;
    spentOn: string;
    /** In minor units of `currency`. */
    amountMinor: number;
    currency: string;
    description: string;
    /** Null while a draft has no receipt yet. Every sent claim has one. */
    receiptFileName: Nullable<string>;
    receiptContentType: Nullable<string>;
    status: HrExpenseClaimStatus;
    submittedAt: Nullable<IsoDateTime>;
    decidedAt: Nullable<IsoDateTime>;
    decidedByName: Nullable<string>;
    decisionNote: Nullable<string>;
    /** The month of the pay run that has taken this claim, paid or not yet. */
    payrollPeriod: Nullable<string>;
    paidVia: Nullable<HrExpensePaidVia>;
    paidOn: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface HrExpenseClaimsPage {
    items: HrExpenseClaim[];
    total: number;
    limit: number;
    offset: number;
}

export interface CreateHrExpenseClaimRequest {
    categoryId: UUID;
    spentOn: string;
    amountMinor: number;
    description: string;
    submit?: string;
}

export interface DecideHrExpenseClaimRequest {
    note?: Nullable<string>;
}

export interface HrPayExpenseClaimRequest {
    paidOn: string;
}

export interface HrSaveExpenseCategoryRequest {
    name: LocalizedText;
    code: string;
    sortOrder?: number;
}

export interface UpdateHrExpenseCategoryRequest {
    name?: LocalizedText;
    sortOrder?: number;
    status?: HrResourceStatus;
}

export interface UpdateHrExpenseClaimRequest {
    categoryId?: UUID;
    spentOn?: string;
    amountMinor?: number;
    description?: string;
}
