import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { GymSignatureMethod } from './gym-signature-method.enum.js';

export interface GymWaiver {
    id: UUID;
    version: number;
    body: LocalizedText;
    isCurrent: boolean;
    createdAt: IsoDateTime;
}

export interface PublishGymWaiverRequest {
    body: LocalizedText;
}

/** A signature keeps the exact words signed, so a later version cannot change what somebody agreed to. */
export interface GymWaiverSignature {
    id: UUID;
    memberId: UUID;
    waiverId: UUID;
    waiverVersion: number;
    locale: string;
    body: string;
    signedName: string;
    method: GymSignatureMethod;
    recordedByUserId: Nullable<UUID>;
    signedAt: IsoDateTime;
}

export interface SignGymWaiverRequest {
    signedName: string;
    locale: string;
}
