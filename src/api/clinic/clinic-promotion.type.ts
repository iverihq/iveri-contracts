import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { LocalizedText } from './localized-text.type.js';

/**
 * A percentage off the treatments it names, at the branches it names.
 *
 * `startsOn` and `endsOn` are calendar days (`YYYY-MM-DD`), both included, read in the branch's own
 * time zone. What matters is the day of the visit, not the day it was booked.
 */
export interface ClinicPromotion {
    id: UUID;
    name: LocalizedText;
    description: Nullable<LocalizedText>;
    discountPercent: number;
    startsOn: string;
    endsOn: string;
    /** Whether the site may announce this across the top of every page. */
    showInBanner: boolean;
    treatmentIds: UUID[];
    locationIds: UUID[];
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface SaveClinicPromotionRequest {
    name: LocalizedText;
    description?: Nullable<LocalizedText>;
    discountPercent: number;
    startsOn: string;
    endsOn: string;
    showInBanner: boolean;
    treatmentIds: UUID[];
    locationIds: UUID[];
}
