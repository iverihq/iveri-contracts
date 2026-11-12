import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrResourceStatus } from './hr-resource-status.enum.js';

export interface HrCompanyValue {
    id: UUID;
    name: string;
    description: Nullable<string>;
    sortOrder: number;
    status: HrResourceStatus;
}

export interface HrThanksPage {
    items: HrThanks[];
    total: number;
    limit: number;
    offset: number;
}

export interface HrThanks {
    id: UUID;
    fromEmployeeId: UUID;
    fromName: string;
    toEmployeeId: UUID;
    toName: string;
    message: string;
    valueId: Nullable<UUID>;
    valueName: Nullable<string>;
    createdAt: IsoDateTime;
    /** Only HR's list carries hidden ones. */
    hiddenAt: Nullable<IsoDateTime>;
    hiddenReason: Nullable<string>;
}

export interface HrHideThanksRequest {
    reason?: Nullable<string>;
}

export interface HrSaveCompanyValueRequest {
    name: string;
    description?: Nullable<string>;
    sortOrder?: number;
}

export interface HrSendThanksRequest {
    toEmployeeId: UUID;
    message: string;
    valueId?: Nullable<UUID>;
}

export interface UpdateHrCompanyValueRequest {
    name?: string;
    description?: Nullable<string>;
    sortOrder?: number;
    status?: HrResourceStatus;
}
