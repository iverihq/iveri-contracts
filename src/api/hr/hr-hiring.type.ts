import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrApplicationSource } from './hr-application-source.enum.js';
import type { HrApplicationStage } from './hr-application-stage.enum.js';
import type { HrEmploymentType } from './hr-employment-type.enum.js';
import type { HrOpeningStatus } from './hr-opening-status.enum.js';

export interface HrApplicationDetail {
    application: HrApplication;
    notes: HrApplicationNote[];
}

export interface HrApplicationNote {
    id: UUID;
    body: string;
    authorName: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface HrApplication {
    id: UUID;
    openingId: UUID;
    openingTitle: string;
    firstName: Nullable<string>;
    lastName: Nullable<string>;
    email: Nullable<string>;
    phone: Nullable<string>;
    coverLetter: Nullable<string>;
    hasCv: boolean;
    stage: HrApplicationStage;
    source: HrApplicationSource;
    consentedAt: IsoDateTime;
    stageChangedAt: IsoDateTime;
    decidedAt: Nullable<IsoDateTime>;
    hiredEmployeeId: Nullable<UUID>;
    isRemoved: boolean;
    createdAt: IsoDateTime;
}

export interface HrCareersOpening {
    id: UUID;
    title: string;
    departmentName: Nullable<string>;
    location: Nullable<string>;
    employmentType: HrEmploymentType;
    description: string;
    openedAt: Nullable<IsoDateTime>;
}

export interface HrCareersPage {
    companyName: string;
    openings: HrCareersOpening[];
}

export interface HrOpening {
    id: UUID;
    title: string;
    departmentId: Nullable<UUID>;
    departmentName: Nullable<string>;
    location: Nullable<string>;
    employmentType: HrEmploymentType;
    description: string;
    status: HrOpeningStatus;
    openedAt: Nullable<IsoDateTime>;
    closedAt: Nullable<IsoDateTime>;
    applicationCount: number;
    activeCount: number;
    createdAt: IsoDateTime;
}

export interface AddHrApplicationNoteRequest {
    body: string;
}

export interface HrApplyRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    coverLetter?: string;
    consent: string;
}

export interface HrHireApplicantRequest {
    workEmail: string;
    hireDate: string;
    employmentType?: HrEmploymentType;
    jobTitleId?: UUID;
    locationId?: UUID;
    managerId?: UUID;
}

export interface HrMoveStageRequest {
    stage: HrApplicationStage;
}

export interface HrSaveOpeningRequest {
    title: string;
    departmentId?: UUID | null;
    location?: string | null;
    employmentType: HrEmploymentType;
    description: string;
}

export interface UpdateHrOpeningRequest {
    title?: string;
    departmentId?: UUID | null;
    location?: string | null;
    employmentType?: HrEmploymentType;
    description?: string;
}
