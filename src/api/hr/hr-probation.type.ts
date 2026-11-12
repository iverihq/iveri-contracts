import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrProbationOutcome } from './hr-probation-outcome.enum.js';

export interface HrProbationDecision {
    id: UUID;
    employeeId: UUID;
    probationEndDate: string;
    outcome: HrProbationOutcome;
    extendedTo: Nullable<string>;
    note: Nullable<string>;
    decidedByName: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface HrProbationDue {
    employeeId: UUID;
    employeeName: string;
    jobTitleName: Nullable<string>;
    departmentName: Nullable<string>;
    managerName: Nullable<string>;
    hireDate: string;
    probationEndDate: string;
    /** Days until it ends; below zero, it has ended with nothing decided. */
    daysLeft: number;
}

export interface HrProbation {
    employeeId: UUID;
    probationEndDate: Nullable<string>;
    /** Whether the end date they are on now has been decided. */
    isDecided: boolean;
    /** Newest first. */
    decisions: HrProbationDecision[];
}

export interface DecideHrProbationRequest {
    /** The end date being decided, as the decider saw it, so a decision made on a date since moved is refused. */
    probationEndDate: string;
    outcome: HrProbationOutcome;
    /** The new end date, for an extension only. */
    extendedTo?: Nullable<string>;
    note?: Nullable<string>;
}
