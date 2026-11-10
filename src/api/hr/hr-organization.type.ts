import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrResourceStatus } from './hr-resource-status.enum.js';

export interface HrCompany {
    companyName: string;
    countryCode: string;
    timeZone: string;
    currency: string;
    workingWeekdays: number[];
    workdayMinutes: number;
    capturesClockLocation: boolean;
    incomeTaxBasisPoints: number;
    pensionEmployeeBasisPoints: number;
    pensionEmployerBasisPoints: number;
    careersSlug: string | null;
    applicantRetentionDays: number;
}

export interface HrDepartment {
    id: UUID;
    name: string;
    parentId: Nullable<UUID>;
    headEmployeeId: Nullable<UUID>;
    headName: Nullable<string>;
    status: HrResourceStatus;
    employeeCount: number;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface HrJobTitle {
    id: UUID;
    name: string;
    status: HrResourceStatus;
    employeeCount: number;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface HrLocation {
    id: UUID;
    name: string;
    city: Nullable<string>;
    address: Nullable<string>;
    status: HrResourceStatus;
    employeeCount: number;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateHrDepartmentRequest {
    name: string;
    parentId?: Nullable<UUID>;
    headEmployeeId?: Nullable<UUID>;
}

export interface CreateHrJobTitleRequest {
    name: string;
}

export interface CreateHrLocationRequest {
    name: string;
    city?: Nullable<string>;
    address?: Nullable<string>;
}

export interface UpdateHrCompanyRequest {
    companyName?: string;
    countryCode?: string;
    timeZone?: string;
    currency?: string;
    workingWeekdays?: number[];
    workdayMinutes?: number;
    capturesClockLocation?: boolean;
    incomeTaxBasisPoints?: number;
    pensionEmployeeBasisPoints?: number;
    pensionEmployerBasisPoints?: number;
    careersSlug?: string;
    applicantRetentionDays?: number;
}

export interface UpdateHrDepartmentRequest {
    name?: string;
    parentId?: Nullable<UUID>;
    headEmployeeId?: Nullable<UUID>;
    status?: HrResourceStatus;
}

export interface UpdateHrJobTitleRequest {
    name?: string;
    status?: HrResourceStatus;
}

export interface UpdateHrLocationRequest {
    name?: string;
    city?: Nullable<string>;
    address?: Nullable<string>;
    status?: HrResourceStatus;
}
