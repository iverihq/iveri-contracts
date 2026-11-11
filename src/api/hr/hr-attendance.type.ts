import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrAttendanceCorrectionStatus } from './hr-attendance-correction-status.enum.js';
import type { HrAttendanceSource } from './hr-attendance-source.enum.js';
import type { HrAttendanceState } from './hr-attendance-state.enum.js';
import type { LocalizedText } from './localized-text.type.js';

export interface HrAttendanceCorrection {
    id: UUID;
    employeeId: UUID;
    employeeName: string;
    entryId: Nullable<UUID>;
    workDate: string;
    clockIn: IsoDateTime;
    clockOut: IsoDateTime;
    reason: string;
    status: HrAttendanceCorrectionStatus;
    decidedByName: Nullable<string>;
    decidedAt: Nullable<IsoDateTime>;
    decisionNote: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface HrAttendanceCorrectionsPage {
    items: HrAttendanceCorrection[];
    total: number;
    limit: number;
    offset: number;
}

export interface HrAttendanceEntry {
    id: UUID;
    employeeId: UUID;
    workDate: string;
    clockIn: IsoDateTime;
    clockOut: Nullable<IsoDateTime>;
    source: HrAttendanceSource;
    note: Nullable<string>;
}

export interface HrAttendanceSummary {
    from: string;
    to: string;
    rows: HrAttendanceSummaryRow[];
}

export interface HrAttendanceSummaryRow {
    employeeId: UUID;
    employeeName: string;
    departmentName: Nullable<string>;
    minutes: number;
    expectedMinutes: number;
    overtimeMinutes: number;
    daysWorked: number;
}

export interface HrAttendanceToday {
    date: string;
    rows: HrAttendanceTodayRow[];
    inCount: number;
    outCount: number;
    awayCount: number;
    notInCount: number;
}

export interface HrAttendanceTodayRow {
    employeeId: UUID;
    employeeName: string;
    departmentName: Nullable<string>;
    jobTitleName: Nullable<string>;
    state: HrAttendanceState;
    clockIn: Nullable<IsoDateTime>;
    clockOut: Nullable<IsoDateTime>;
    minutes: number;
}

export interface HrMyAttendance {
    openEntry: Nullable<HrAttendanceEntry>;
    isForgotten: boolean;
    todayMinutes: number;
    weekMinutes: number;
    weekExpectedMinutes: number;
    timeZone: string;
    capturesClockLocation: boolean;
}

export interface HrTimesheetDay {
    date: string;
    minutes: number;
    expectedMinutes: number;
    isWorkingDay: boolean;
    holidayName: Nullable<LocalizedText>;
    isOnLeave: boolean;
    entries: HrAttendanceEntry[];
}

export interface HrTimesheet {
    from: string;
    to: string;
    days: HrTimesheetDay[];
    totalMinutes: number;
    expectedMinutes: number;
    overtimeMinutes: number;
}

export interface AddHrEntryRequest {
    clockIn: string;
    clockOut: string;
    note?: string;
}

export interface HrClockInRequest {
    latitude?: number;
    longitude?: number;
}

export interface DecideHrCorrectionRequest {
    note?: string;
}

export interface HrRequestCorrectionRequest {
    entryId?: UUID;
    clockIn: string;
    clockOut: string;
    reason: string;
}
