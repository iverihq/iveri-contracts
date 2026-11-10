import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { GymMediaImage } from './gym-common.type.js';

export interface GymGalleryItem {
    id: UUID;
    image: GymMediaImage;
    caption: Nullable<LocalizedText>;
    sortOrder: number;
    createdAt: IsoDateTime;
}

export interface CreateGymGalleryItemRequest {
    image: GymMediaImage;
    caption?: Nullable<LocalizedText>;
    sortOrder?: number;
}
