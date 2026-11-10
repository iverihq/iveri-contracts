import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrEmploymentEventKind } from './hr-employment-event-kind.enum.js';
import type { HrEmploymentStatus } from './hr-employment-status.enum.js';
import type { HrEmploymentType } from './hr-employment-type.enum.js';

export interface HrEmployee {
    id: UUID;
    employeeNumber: string;
    firstName: string;
    lastName: string;
    displayName: string;
    workEmail: string;
    phone: Nullable<string>;
    departmentId: Nullable<UUID>;
    departmentName: Nullable<string>;
    jobTitleId: Nullable<UUID>;
    jobTitleName: Nullable<string>;
    locationId: Nullable<UUID>;
    locationName: Nullable<string>;
    managerId: Nullable<UUID>;
    managerName: Nullable<string>;
    employmentType: HrEmploymentType;
    status: HrEmploymentStatus;
    hireDate: string;
    terminationDate: Nullable<string>;
    hasAccount: boolean;
    userId: Nullable<UUID>;
    personalEmail: Nullable<string>;
    dateOfBirth: Nullable<string>;
    nationality: Nullable<string>;
    address: Nullable<string>;
    emergencyContactName: Nullable<string>;
    emergencyContactPhone: Nullable<string>;
    emergencyContactRelation: Nullable<string>;
    probationEndDate: Nullable<string>;
    terminationReason: Nullable<string>;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface HrEmployeeSummary {
    id: UUID;
    employeeNumber: string;
    firstName: string;
    lastName: string;
    displayName: string;
    workEmail: string;
    phone: Nullable<string>;
    departmentId: Nullable<UUID>;
    departmentName: Nullable<string>;
    jobTitleId: Nullable<UUID>;
    jobTitleName: Nullable<string>;
    locationId: Nullable<UUID>;
    locationName: Nullable<string>;
    managerId: Nullable<UUID>;
    managerName: Nullable<string>;
    employmentType: HrEmploymentType;
    status: HrEmploymentStatus;
    hireDate: string;
    terminationDate: Nullable<string>;
    hasAccount: boolean;
}

export interface HrEmployeesPage {
    items: HrEmployeeSummary[];
    total: number;
    limit: number;
    offset: number;
}

export interface HrEmploymentEvent {
    id: UUID;
    kind: HrEmploymentEventKind;
    effectiveDate: string;
    before: unknown;
    after: unknown;
    note: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface HrImportResult {
    isDryRun: boolean;
    createdCount: number;
    refusedCount: number;
    rows: HrImportRowResult[];
}

export interface HrImportRowResult {
    row: number;
    isCreated: boolean;
    employeeId: Nullable<UUID>;
    message: Nullable<string>;
}

export interface HrInvitation {
    userId: UUID;
    invitationToken: string;
    invitationExpiresAt: string;
    isEmailSent: boolean;
}

export interface HrOrgChartNode {
    id: UUID;
    displayName: string;
    jobTitleName: Nullable<string>;
    departmentName: Nullable<string>;
    locationName: Nullable<string>;
    managerId: Nullable<UUID>;
    reportCount: number;
}

export interface HrOverviewCelebration {
    employeeId: UUID;
    displayName: string;
    jobTitleName: Nullable<string>;
    date: string;
    isBirthday: boolean;
    years: Nullable<number>;
}

export interface HrOverviewDepartment {
    departmentId: Nullable<UUID>;
    departmentName: Nullable<string>;
    count: number;
}

export interface HrOverviewMovement {
    month: string;
    joined: number;
    left: number;
}

export interface HrOverview {
    headcount: number;
    upcomingCount: number;
    leavingCount: number;
    withoutAccountCount: number;
    byDepartment: HrOverviewDepartment[];
    movements: HrOverviewMovement[];
    startingSoon: HrEmployeeSummary[];
    leavingSoon: HrEmployeeSummary[];
    celebrations: HrOverviewCelebration[];
}

export interface ChangeHrJobRequest {
    effectiveDate: string;
    departmentId?: Nullable<UUID>;
    jobTitleId?: Nullable<UUID>;
    locationId?: Nullable<UUID>;
    managerId?: Nullable<UUID>;
    employmentType?: HrEmploymentType;
    note?: string;
}

export interface CreateHrEmployeeRequest {
    firstName: string;
    lastName: string;
    workEmail: string;
    employmentType: HrEmploymentType;
    hireDate: string;
    employeeNumber?: string;
    personalEmail?: Nullable<string>;
    phone?: Nullable<string>;
    dateOfBirth?: Nullable<string>;
    nationality?: Nullable<string>;
    address?: Nullable<string>;
    emergencyContactName?: Nullable<string>;
    emergencyContactPhone?: Nullable<string>;
    emergencyContactRelation?: Nullable<string>;
    departmentId?: Nullable<UUID>;
    jobTitleId?: Nullable<UUID>;
    locationId?: Nullable<UUID>;
    managerId?: Nullable<UUID>;
    probationEndDate?: Nullable<string>;
}

export interface ImportHrEmployeeRowRequest {
    firstName?: string;
    lastName?: string;
    workEmail?: string;
    hireDate?: string;
    employmentType?: string;
    employeeNumber?: string;
    phone?: string;
    personalEmail?: string;
    dateOfBirth?: string;
    departmentName?: string;
    jobTitleName?: string;
    locationName?: string;
    managerEmail?: string;
}

export interface ImportHrEmployeesRequest {
    rows: ImportHrEmployeeRowRequest[];
    dryRun?: boolean;
}

export interface LinkHrAccountRequest {
    userId: Nullable<UUID>;
}

export interface SetHrTerminationRequest {
    lastDay: string;
    reason?: string;
    reportsMoveToEmployeeId?: UUID;
}

export interface UpdateHrEmployeeRequest {
    firstName?: string;
    lastName?: string;
    workEmail?: string;
    employeeNumber?: string;
    hireDate?: string;
    personalEmail?: Nullable<string>;
    phone?: Nullable<string>;
    dateOfBirth?: Nullable<string>;
    nationality?: Nullable<string>;
    address?: Nullable<string>;
    emergencyContactName?: Nullable<string>;
    emergencyContactPhone?: Nullable<string>;
    emergencyContactRelation?: Nullable<string>;
    probationEndDate?: Nullable<string>;
}
