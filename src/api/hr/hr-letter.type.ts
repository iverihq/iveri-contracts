import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrLetterKind } from './hr-letter-kind.enum.js';
import type { HrLetterRequestStatus } from './hr-letter-request-status.enum.js';

export interface HrLetterRequest {
    id: UUID;
    employeeId: UUID;
    employeeName: string;
    departmentName: Nullable<string>;
    kind: HrLetterKind;
    purpose: string;
    language: string;
    status: HrLetterRequestStatus;
    decidedAt: Nullable<IsoDateTime>;
    decidedByName: Nullable<string>;
    declineReason: Nullable<string>;
    /** The letter among the person's documents, downloadable from `/me/documents/:documentId/download`. */
    documentId: Nullable<UUID>;
    createdAt: IsoDateTime;
}

export interface HrLetterRequestsPage {
    items: HrLetterRequest[];
    total: number;
    limit: number;
    offset: number;
}

export interface HrAnswerLetterRequest {
    title?: string;
}

export interface HrAskLetterRequest {
    kind: HrLetterKind;
    purpose: string;
    language: string;
}

export interface HrDeclineLetterRequest {
    reason: string;
}
