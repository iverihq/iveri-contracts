import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { LocalizedText } from './localized-text.type.js';

/** One version of what a client agrees to before a treatment. A change is a new version. */
export interface ClinicConsentForm {
    id: UUID;
    treatmentId: UUID;
    version: number;
    body: LocalizedText;
    createdAt: IsoDateTime;
}

export interface PublishClinicConsentFormRequest {
    body: LocalizedText;
}
