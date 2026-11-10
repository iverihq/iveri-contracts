import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrDocumentAudience } from './hr-document-audience.enum.js';
import type { LocalizedText } from './localized-text.type.js';

export interface HrDocument {
    id: UUID;
    employeeId: UUID;
    employeeName: string;
    title: string;
    category: string;
    originalName: string;
    contentType: string;
    sizeBytes: number;
    audience: HrDocumentAudience;
    expiresOn: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface HrMyPolicy {
    id: UUID;
    title: LocalizedText;
    body: LocalizedText;
    version: number;
    publishedAt: IsoDateTime;
    acknowledgedAt: Nullable<IsoDateTime>;
}

export interface HrPolicyAcknowledgement {
    employeeId: UUID;
    employeeName: string;
    departmentName: Nullable<string>;
    acknowledgedAt: Nullable<IsoDateTime>;
}

export interface HrPolicy {
    id: UUID;
    title: LocalizedText;
    body: LocalizedText;
    version: number;
    publishedAt: Nullable<IsoDateTime>;
    acknowledgedCount: number;
    employeeCount: number;
}

export interface HrAcknowledgePolicyRequest {
    version: number;
}

export interface HrSavePolicyRequest {
    title: LocalizedText;
    body: LocalizedText;
}

export interface UpdateHrDocumentRequest {
    title?: string;
    category?: string;
    audience?: HrDocumentAudience;
    expiresOn?: Nullable<string>;
}

export interface HrUploadDocumentRequest {
    title: string;
    category: string;
    audience?: HrDocumentAudience;
    expiresOn?: string;
}
