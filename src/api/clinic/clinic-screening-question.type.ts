import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { LocalizedText } from './localized-text.type.js';

/** A yes or no question a treatment asks first. Which answer matters is the clinic's judgement. */
export interface ClinicScreeningQuestion {
    id: UUID;
    treatmentId: UUID;
    text: LocalizedText;
    /** The answer that rules the treatment out, or `null` when it is only for the specialist to read. */
    stopsBookingOn: Nullable<boolean>;
    sortOrder: number;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateClinicScreeningQuestionRequest {
    text: LocalizedText;
    stopsBookingOn?: Nullable<boolean>;
}

export interface UpdateClinicScreeningQuestionRequest {
    text?: LocalizedText;
    stopsBookingOn?: Nullable<boolean>;
    sortOrder?: number;
}
