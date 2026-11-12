import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrLeaveAccrual } from './hr-leave-accrual.enum.js';
import type { HrLeaveAllowancePeriod } from './hr-leave-allowance-period.enum.js';
import type { HrLeaveEligibilityExceptionKind } from './hr-leave-eligibility-exception-kind.enum.js';
import type { HrLeaveLedgerKind } from './hr-leave-ledger-kind.enum.js';
import type { HrLeaveRequestStatus } from './hr-leave-request-status.enum.js';
import type { HrResourceStatus } from './hr-resource-status.enum.js';
import type { LocalizedText } from './localized-text.type.js';

export interface HrAbsence {
    requestId: UUID;
    employeeId: UUID;
    employeeName: string;
    departmentName: Nullable<string>;
    leaveTypeName: LocalizedText;
    startDate: string;
    endDate: string;
    startsAfternoon: boolean;
    endsAtNoon: boolean;
}

export interface HrEmployeeTimeOff {
    year: number;
    balances: HrLeaveBalance[];
    ledger: HrLedgerEntry[];
}

export interface HrLeaveBalance {
    leaveTypeId: UUID;
    leaveTypeName: LocalizedText;
    year: number;
    isPaid: boolean;
    tracksBalance: boolean;
    grantedHalfDays: number;
    takenHalfDays: number;
    pendingHalfDays: number;
    availableHalfDays: number;
    allowancePeriod: HrLeaveAllowancePeriod;
    /** The year, or for a quarterly type the quarter these figures are for. */
    periodStart: string;
    periodEnd: string;
    /** While somebody is still waiting to be allowed this kind of leave, the first day they may take it. */
    availableFrom: Nullable<string>;
}

export interface HrLeaveEligibilityException {
    id: UUID;
    leaveTypeId: UUID;
    kind: HrLeaveEligibilityExceptionKind;
    availableFrom: Nullable<string>;
    reason: string;
    decidedByName: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface HrLeaveEligibility {
    leaveTypeId: UUID;
    leaveTypeName: LocalizedText;
    availableAfterMonths: number;
    /** What the type's waiting period alone gives, or null when there is none. */
    ruleAvailableFrom: Nullable<string>;
    /** What counts, after any exception. Null means from the first day. */
    availableFrom: Nullable<string>;
    exceptions: HrLeaveEligibilityException[];
}

export interface HrLeavePreview {
    halfDays: number;
    availableHalfDays: Nullable<number>;
    isEnough: boolean;
    /** When these days start before the person may take this kind of leave, the first day they may. */
    availableFrom: Nullable<string>;
}

export interface HrLeaveRequest {
    id: UUID;
    employeeId: UUID;
    employeeName: string;
    departmentName: Nullable<string>;
    jobTitleName: Nullable<string>;
    leaveTypeId: UUID;
    leaveTypeName: LocalizedText;
    isPaid: boolean;
    startDate: string;
    endDate: string;
    startsAfternoon: boolean;
    endsAtNoon: boolean;
    halfDays: number;
    reason: Nullable<string>;
    status: HrLeaveRequestStatus;
    decidedByName: Nullable<string>;
    decidedAt: Nullable<IsoDateTime>;
    decisionNote: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface HrLeaveRequestsPage {
    items: HrLeaveRequest[];
    total: number;
    limit: number;
    offset: number;
}

export interface HrLeaveType {
    id: UUID;
    name: LocalizedText;
    code: string;
    isPaid: boolean;
    tracksBalance: boolean;
    annualAllowanceHalfDays: number;
    accrual: HrLeaveAccrual;
    allowancePeriod: HrLeaveAllowancePeriod;
    /** Months of service before it can be taken. */
    availableAfterMonths: number;
    carryOverMaxHalfDays: number;
    requiresApproval: boolean;
    requiresDocument: boolean;
    minNoticeDays: number;
    sortOrder: number;
    status: HrResourceStatus;
}

export interface HrLedgerEntry {
    id: UUID;
    leaveTypeId: UUID;
    leaveTypeName: LocalizedText;
    year: number;
    kind: HrLeaveLedgerKind;
    halfDays: number;
    note: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface HrPublicHoliday {
    id: UUID;
    date: string;
    name: LocalizedText;
}

export interface HrTimeOffCalendar {
    holidays: HrPublicHoliday[];
    absences: HrAbsence[];
}

export interface HrTimeOffSummary {
    pendingCount: number;
    awayToday: HrAbsence[];
}

export interface AddHrLeaveEligibilityExceptionRequest {
    leaveTypeId: UUID;
    kind: HrLeaveEligibilityExceptionKind;
    availableFrom?: Nullable<string>;
    reason: string;
}

export interface AdjustHrBalanceRequest {
    leaveTypeId: UUID;
    year: number;
    halfDays: number;
    note: string;
}

export interface CreateHrHolidayRequest {
    date: string;
    name: LocalizedText;
}

export interface CreateHrLeaveRequestForEmployeeRequest extends HrLeaveDaysRequest {
    employeeId: UUID;
    isApproved?: boolean;
}

export interface CreateHrLeaveTypeRequest {
    name: LocalizedText;
    code: string;
    isPaid?: boolean;
    tracksBalance?: boolean;
    annualAllowanceHalfDays?: number;
    accrual?: HrLeaveAccrual;
    /** Per year, or a quarter of `annualAllowanceHalfDays` at the start of each quarter with nothing carried over. */
    allowancePeriod?: HrLeaveAllowancePeriod;
    /** Months of service before it can be taken. The balance grows meanwhile. */
    availableAfterMonths?: number;
    carryOverMaxHalfDays?: number;
    requiresApproval?: boolean;
    requiresDocument?: boolean;
    minNoticeDays?: number;
    sortOrder?: number;
}

export interface DecideHrLeaveRequestRequest {
    note?: string;
}

export interface ImportHrHolidaysRequest {
    year: number;
}

export interface HrLeaveDaysRequest {
    leaveTypeId: UUID;
    startDate: string;
    endDate: string;
    startsAfternoon?: boolean;
    endsAtNoon?: boolean;
    reason?: Nullable<string>;
}

export interface UpdateHrLeaveTypeRequest extends Partial<Omit<CreateHrLeaveTypeRequest, 'code'>> {
    status?: HrResourceStatus;
}
