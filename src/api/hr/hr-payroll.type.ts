import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrPayItemKind } from './hr-pay-item-kind.enum.js';
import type { HrPayrollRunStatus } from './hr-payroll-run-status.enum.js';

export interface HrPayItem {
    id: UUID;
    employeeId: UUID;
    kind: HrPayItemKind;
    name: string;
    amountMinor: number;
    period: Nullable<string>;
    isTaxable: boolean;
}

export interface HrPayrollRunDetail {
    run: HrPayrollRun;
    payslips: HrPayslip[];
    skippedNames: string[];
}

export interface HrPayrollRun {
    id: UUID;
    period: string;
    status: HrPayrollRunStatus;
    currency: string;
    employeeCount: number;
    grossTotalMinor: number;
    netTotalMinor: number;
    employerCostMinor: number;
    calculatedAt: Nullable<IsoDateTime>;
    approvedAt: Nullable<IsoDateTime>;
    approvedByName: Nullable<string>;
}

export interface HrPayslipLine {
    label: string;
    amountMinor: number;
    /** The expense claim this line pays back, or null for anything else on a payslip. */
    expenseClaimId: Nullable<UUID>;
}

export interface HrPayslip {
    id: UUID;
    runId: UUID;
    period: string;
    employeeId: UUID;
    employeeName: string;
    jobTitleName: Nullable<string>;
    departmentName: Nullable<string>;
    currency: string;
    baseMinor: number;
    additionsMinor: number;
    deductionsMinor: number;
    grossMinor: number;
    pensionEmployeeMinor: number;
    pensionEmployerMinor: number;
    incomeTaxMinor: number;
    netMinor: number;
    additions: HrPayslipLine[];
    deductions: HrPayslipLine[];
}

export interface CreateHrPayItemRequest {
    kind: HrPayItemKind;
    name: string;
    amountMinor: number;
    period?: string;
    isTaxable?: boolean;
}

export interface CreateHrPayrollRunRequest {
    period: string;
}
