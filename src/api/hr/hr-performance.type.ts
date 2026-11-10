import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrGoalStatus } from './hr-goal-status.enum.js';
import type { HrOneToOneRole } from './hr-one-to-one-role.enum.js';
import type { HrReviewCycleStatus } from './hr-review-cycle-status.enum.js';
import type { HrReviewQuestionKind } from './hr-review-question-kind.enum.js';
import type { HrReviewStatus } from './hr-review-status.enum.js';

export interface HrGoalCheckIn {
    id: UUID;
    progress: number;
    status: HrGoalStatus;
    note: Nullable<string>;
    authorName: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface HrGoalDetail {
    goal: HrGoal;
    checkIns: HrGoalCheckIn[];
}

export interface HrGoal {
    id: UUID;
    employeeId: UUID;
    employeeName: string;
    title: string;
    description: Nullable<string>;
    dueOn: Nullable<string>;
    progress: number;
    status: HrGoalStatus;
    completedAt: Nullable<IsoDateTime>;
    createdByName: Nullable<string>;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface HrOneToOne {
    id: UUID;
    managerEmployeeId: UUID;
    managerName: string;
    reportEmployeeId: UUID;
    reportName: string;
    scheduledFor: IsoDateTime;
    agenda: Nullable<string>;
    sharedNotes: Nullable<string>;
    managerNotes: Nullable<string>;
    completedAt: Nullable<IsoDateTime>;
    myRole: HrOneToOneRole;
}

export interface HrReviewCycle {
    id: UUID;
    name: string;
    periodStart: string;
    periodEnd: string;
    selfDueOn: string;
    managerDueOn: string;
    questions: HrReviewQuestion[];
    status: HrReviewCycleStatus;
    openedAt: Nullable<IsoDateTime>;
    closedAt: Nullable<IsoDateTime>;
    reviewCount: number;
    selfSubmittedCount: number;
    managerSubmittedCount: number;
    createdAt: IsoDateTime;
}

export interface HrReviewQuestion {
    id: string;
    text: string;
    kind: HrReviewQuestionKind;
}

export interface HrReview {
    id: UUID;
    cycleId: UUID;
    cycleName: string;
    cycleStatus: HrReviewCycleStatus;
    periodStart: string;
    periodEnd: string;
    selfDueOn: string;
    managerDueOn: string;
    questions: HrReviewQuestion[];
    employeeId: UUID;
    employeeName: string;
    reviewerEmployeeId: Nullable<UUID>;
    reviewerName: Nullable<string>;
    selfStatus: HrReviewStatus;
    selfAnswers: Nullable<Record<string, number | string>>;
    selfSubmittedAt: Nullable<IsoDateTime>;
    managerStatus: HrReviewStatus;
    managerAnswers: Nullable<Record<string, number | string>>;
    overallRating: Nullable<number>;
    managerSubmittedAt: Nullable<IsoDateTime>;
    managerSubmittedByName: Nullable<string>;
}

export interface HrAssignReviewerRequest {
    reviewerEmployeeId: UUID;
}

export interface HrCheckInGoalRequest {
    progress: number;
    status?: HrGoalStatus;
    note?: string;
}

export interface CreateHrGoalRequest {
    title: string;
    description?: string;
    dueOn?: string;
}

export interface HrReviewQuestionRequest {
    text: string;
    kind: HrReviewQuestionKind;
}

export interface HrSaveAssessmentRequest {
    answers: Record<string, number | string>;
    overallRating?: number;
    submit: boolean;
}

export interface HrSaveReviewCycleRequest {
    name: string;
    periodStart: string;
    periodEnd: string;
    selfDueOn: string;
    managerDueOn: string;
    questions: HrReviewQuestionRequest[];
}

export interface HrSaveSelfReviewRequest {
    answers: Record<string, number | string>;
    submit: boolean;
}

export interface HrScheduleOneToOneRequest {
    scheduledFor: string;
    agenda?: string;
}

export interface UpdateHrGoalRequest {
    title?: string;
    description?: string | null;
    dueOn?: string | null;
}

export interface UpdateHrOneToOneRequest {
    scheduledFor?: string;
    agenda?: string | null;
    sharedNotes?: string | null;
    managerNotes?: string | null;
}

export interface UpdateHrReviewCycleRequest {
    name?: string;
    periodStart?: string;
    periodEnd?: string;
    selfDueOn?: string;
    managerDueOn?: string;
    questions?: HrReviewQuestionRequest[];
}
