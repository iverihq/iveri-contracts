import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ClinicGalleryKind } from './clinic-gallery-kind.enum.js';
import type { ClinicMediaImage } from './clinic-media.type.js';
import type { LocalizedText } from './localized-text.type.js';

export interface ClinicGalleryItem {
    id: UUID;
    kind: ClinicGalleryKind;
    caption: Nullable<LocalizedText>;
    treatmentId: Nullable<UUID>;
    /** For a before and after, this is the after. */
    image: ClinicMediaImage;
    beforeImage: Nullable<ClinicMediaImage>;
    isPublished: boolean;
    consentRecordedAt: Nullable<IsoDateTime>;
    /** Where the client's agreement can be found. Staff only, and never public. */
    consentReference: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface UpdateClinicGalleryItemRequest {
    caption: Nullable<LocalizedText>;
    treatmentId: Nullable<UUID>;
    isPublished: boolean;
}

export interface PublicGalleryItem {
    id: UUID;
    kind: ClinicGalleryKind;
    caption: Nullable<LocalizedText>;
    treatmentId: Nullable<UUID>;
    image: ClinicMediaImage;
    beforeImage: Nullable<ClinicMediaImage>;
}
