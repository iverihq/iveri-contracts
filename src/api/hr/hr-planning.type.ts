import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrPlanningEntryKind } from './hr-planning-entry-kind.enum.js';
import type { HrTeamRole } from './hr-team-role.enum.js';
import type { HrLeaveRequestsPage } from './hr-time-off.type.js';
import type { LocalizedText } from './localized-text.type.js';

export interface HrLeaveClashPerson {
    employeeId: UUID;
    name: string;
}

export interface HrLeaveClash {
    teamId: UUID;
    teamName: string;
    jobTitleId: UUID;
    jobTitleName: string;
    from: string;
    to: string;
    allowedAway: number;
    people: HrLeaveClashPerson[];
}

export interface HrLeavePlan {
    id: UUID;
    leaveTypeId: UUID;
    leaveTypeName: LocalizedText;
    startDate: string;
    endDate: string;
    startsAfternoon: boolean;
    endsAtNoon: boolean;
    halfDays: number;
    note: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface HrLeavePlanTotal {
    leaveTypeId: UUID;
    leaveTypeName: LocalizedText;
    plannedHalfDays: number;
    availableHalfDays: Nullable<number>;
}

export interface HrLeavePlanYear {
    year: number;
    plans: HrLeavePlan[];
    totals: HrLeavePlanTotal[];
}

export interface HrLeavePreviewWithClashes {
    halfDays: number;
    availableHalfDays: Nullable<number>;
    isEnough: boolean;
    /** When these days start before the person may take this kind of leave, the first day they may. */
    availableFrom: Nullable<string>;
    clashes: HrLeaveClash[];
}

export interface HrLeaveRequestClashes {
    requestId: UUID;
    clashes: HrLeaveClash[];
}

export interface HrPlanningEntry {
    kind: HrPlanningEntryKind;
    startDate: string;
    endDate: string;
    startsAfternoon: boolean;
    endsAtNoon: boolean;
    leaveTypeName: Nullable<LocalizedText>;
}

export interface HrSavedLeavePlan {
    plan: HrLeavePlan;
    clashes: HrLeaveClash[];
}

export interface HrTeamRequestsPage extends HrLeaveRequestsPage {
    clashes: HrLeaveRequestClashes[];
}

export interface HrTeamYearHoliday {
    date: string;
    name: LocalizedText;
}

export interface HrTeamYearMember {
    employeeId: UUID;
    name: string;
    jobTitleName: Nullable<string>;
    role: HrTeamRole;
    entries: HrPlanningEntry[];
}

export interface HrTeamYear {
    teamId: UUID;
    teamName: string;
    year: number;
    showsLeaveTypes: boolean;
    members: HrTeamYearMember[];
    holidays: HrTeamYearHoliday[];
    clashes: HrLeaveClash[];
}

export interface HrSaveLeavePlanRequest {
    leaveTypeId: UUID;
    startDate: string;
    endDate: string;
    startsAfternoon?: boolean;
    endsAtNoon?: boolean;
    note?: Nullable<string>;
}
