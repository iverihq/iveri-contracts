import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrEmployeeSummary } from './hr-employee.type.js';
import type { HrEmploymentStatus } from './hr-employment-status.enum.js';
import type { HrLeaveBalance, HrLeaveRequest, HrLeaveType } from './hr-time-off.type.js';
import type { LocalizedText } from './localized-text.type.js';

export interface HrDirectoryEntry {
    id: UUID;
    displayName: string;
    jobTitleName: Nullable<string>;
    departmentName: Nullable<string>;
    locationName: Nullable<string>;
    workEmail: string;
    managerId: Nullable<UUID>;
    managerName: Nullable<string>;
}

export interface HrDirectoryPage {
    items: HrDirectoryEntry[];
    total: number;
    limit: number;
    offset: number;
}

export interface HrMyHome {
    employee: HrEmployeeSummary;
    isManager: boolean;
    pendingApprovalCount: number;
    balances: HrLeaveBalance[];
    nextTimeOff: Nullable<HrLeaveRequest>;
    nextHoliday: Nullable<HrPublicHolidayEntry>;
    awayToday: HrTeamAbsence[];
}

export interface HrMyTimeOff {
    year: number;
    balances: HrLeaveBalance[];
    types: HrLeaveType[];
    upcoming: HrLeaveRequest[];
}

export interface HrPublicHolidayEntry {
    id: UUID;
    date: string;
    name: LocalizedText;
}

export interface HrTeamAbsence {
    employeeId: UUID;
    employeeName: string;
    departmentName: Nullable<string>;
    startDate: string;
    endDate: string;
    startsAfternoon: boolean;
    endsAtNoon: boolean;
}

export interface HrTeamCalendar {
    holidays: HrPublicHolidayEntry[];
    absences: HrTeamAbsence[];
}

export interface HrTeamMember {
    id: UUID;
    displayName: string;
    jobTitleName: Nullable<string>;
    departmentName: Nullable<string>;
    workEmail: string;
    hireDate: string;
    status: HrEmploymentStatus;
    isAwayToday: boolean;
}

export interface UpdateHrMyEmployeeRequest {
    personalEmail?: Nullable<string>;
    phone?: Nullable<string>;
    address?: Nullable<string>;
    emergencyContactName?: Nullable<string>;
    emergencyContactPhone?: Nullable<string>;
    emergencyContactRelation?: Nullable<string>;
    localeCode?: string;
}
