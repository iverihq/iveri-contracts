import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrCourseAssignmentState } from './hr-course-assignment-state.enum.js';
import type { HrCourseCompletionSource } from './hr-course-completion-source.enum.js';
import type { HrResourceStatus } from './hr-resource-status.enum.js';

export interface HrCourseAssignment {
    id: UUID;
    courseId: UUID;
    courseTitle: string;
    courseProvider: Nullable<string>;
    courseUrl: Nullable<string>;
    issuesCertificate: boolean;
    employeeId: UUID;
    employeeName: string;
    dueOn: string;
    /** Worked out from the dates on this read. */
    state: HrCourseAssignmentState;
    lastCompletedOn: Nullable<string>;
    expiresOn: Nullable<string>;
    /** When it has to be done next, or null once done for good. */
    nextDueOn: Nullable<string>;
    /** Newest first, turned-down ones included. */
    completions: HrCourseCompletion[];
}

export interface HrCourseCompletion {
    id: UUID;
    completedOn: string;
    source: HrCourseCompletionSource;
    certificateFileName: Nullable<string>;
    recordedAt: IsoDateTime;
    /** Set when HR turned it down; it then no longer counts. */
    rejectedAt: Nullable<IsoDateTime>;
    rejectionReason: Nullable<string>;
}

export interface HrCourseDetail {
    course: HrCourse;
    assignments: HrCourseAssignment[];
}

export interface HrCourse {
    id: UUID;
    title: string;
    provider: Nullable<string>;
    url: Nullable<string>;
    description: Nullable<string>;
    issuesCertificate: boolean;
    /** Null for a certificate that never lapses, or a course with none. */
    certificateValidMonths: Nullable<number>;
    status: HrResourceStatus;
    assignedCount: number;
    createdAt: IsoDateTime;
}

export interface HrAssignCourseRequest {
    employeeIds?: UUID[];
    departmentId?: UUID;
    jobTitleId?: UUID;
    teamId?: UUID;
    dueOn: string;
}

export interface HrRecordCompletionRequest {
    completedOn: string;
}

export interface HrRejectCompletionRequest {
    reason: string;
}

export interface HrSaveCourseRequest {
    title: string;
    provider?: Nullable<string>;
    url?: Nullable<string>;
    description?: Nullable<string>;
    issuesCertificate?: boolean;
    /** How many months the certificate lasts; left out or null, it never lapses. */
    certificateValidMonths?: Nullable<number>;
}

export interface UpdateHrCourseRequest {
    title?: string;
    provider?: Nullable<string>;
    url?: Nullable<string>;
    description?: Nullable<string>;
    issuesCertificate?: boolean;
    certificateValidMonths?: Nullable<number>;
    status?: HrResourceStatus;
}
