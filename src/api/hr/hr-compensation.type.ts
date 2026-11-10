import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrAccessAction } from './hr-access-action.enum.js';
import type { HrPayPeriod } from './hr-pay-period.enum.js';

export interface HrAccessLogEntry {
    id: UUID;
    action: HrAccessAction;
    actorUserId: UUID;
    actorName: Nullable<string>;
    occurredAt: IsoDateTime;
}

export interface HrAccessLogPage {
    items: HrAccessLogEntry[];
    nextCursor: Nullable<string>;
}

export interface HrPayEntry {
    id: UUID;
    amountMinor: number;
    currency: string;
    payPeriod: HrPayPeriod;
    effectiveFrom: string;
    reason: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface HrPay {
    current: Nullable<HrPayEntry>;
    history: HrPayEntry[];
}

export interface HrPrivateDetails {
    personalNumber: Nullable<string>;
    bankIban: Nullable<string>;
    isPensionParticipant: boolean;
}

export interface AddHrPayRequest {
    amountMinor: number;
    payPeriod: HrPayPeriod;
    effectiveFrom: string;
    currency?: string;
    reason?: string;
}

export interface UpdateHrPrivateRequest {
    personalNumber?: Nullable<string>;
    bankIban?: Nullable<string>;
    isPensionParticipant?: boolean;
}
