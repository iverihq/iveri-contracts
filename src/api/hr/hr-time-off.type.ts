import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrLeaveAccrual } from './hr-leave-accrual.enum.js';
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
}

export interface HrLeavePreview {
    halfDays: number;
    availableHalfDays: Nullable<number>;
    isEnough: boolean;
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
