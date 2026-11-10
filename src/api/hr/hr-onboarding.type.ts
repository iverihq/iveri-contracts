import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrChecklistKind } from './hr-checklist-kind.enum.js';
import type { HrTaskAssignee } from './hr-task-assignee.enum.js';
import type { HrTaskStatus } from './hr-task-status.enum.js';

export interface HrChecklist {
    id: UUID;
    employeeId: UUID;
    employeeName: string;
    name: string;
    kind: HrChecklistKind;
    startDate: string;
    tasks: HrChecklistTask[];
}

export interface HrChecklistTask {
    id: UUID;
    checklistId: UUID;
    employeeId: UUID;
    employeeName: string;
    checklistName: string;
    title: string;
    assignee: HrTaskAssignee;
    dueDate: string;
    status: HrTaskStatus;
    completedAt: Nullable<IsoDateTime>;
    completedByName: Nullable<string>;
}

export interface HrChecklistTemplate {
    id: UUID;
    name: string;
    kind: HrChecklistKind;
    tasks: HrChecklistTemplateTask[];
}

export interface HrChecklistTemplateTask {
    id: UUID;
    title: string;
    assignee: HrTaskAssignee;
    dueOffsetDays: number;
}

export interface HrSaveTemplateRequest {
    name: string;
    kind: HrChecklistKind;
    tasks: HrTemplateTaskRequest[];
}

export interface HrStartChecklistRequest {
    templateId: UUID;
}

export interface HrTemplateTaskRequest {
    title: string;
    assignee: HrTaskAssignee;
    dueOffsetDays?: number;
}
