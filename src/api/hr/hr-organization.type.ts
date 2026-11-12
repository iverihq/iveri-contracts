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
    /** How many days in one Monday-to-Sunday week somebody may work from home, or null for no limit. */
    homeDaysPerWeek: Nullable<number>;
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
    /** How many desks the office has, when HR has said; null when nobody counts them. */
    deskCount: Nullable<number>;
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
    deskCount?: Nullable<number>;
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
    /** Null lifts the limit. */
    homeDaysPerWeek?: Nullable<number>;
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
    /** Null stops counting desks. */
    deskCount?: Nullable<number>;
    status?: HrResourceStatus;
}
