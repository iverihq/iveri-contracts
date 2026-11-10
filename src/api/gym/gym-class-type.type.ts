import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { GymClassLevel } from './gym-class-level.enum.js';
import type { GymMediaImage } from './gym-common.type.js';
import type { GymResourceStatus } from './gym-resource-status.enum.js';

export interface GymClassType {
    id: UUID;
    slug: string;
    name: LocalizedText;
    description: Nullable<LocalizedText>;
    level: GymClassLevel;
    durationMinutes: number;
    defaultCapacity: number;
    /** A `#rrggbb` colour for the timetable, chosen by the gym. */
    color: Nullable<string>;
    image: Nullable<GymMediaImage>;
    status: GymResourceStatus;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateGymClassTypeRequest {
    slug: string;
    name: LocalizedText;
    description?: Nullable<LocalizedText>;
    level?: GymClassLevel;
    durationMinutes: number;
    defaultCapacity: number;
    color?: Nullable<string>;
    image?: Nullable<GymMediaImage>;
}

export type UpdateGymClassTypeRequest = Partial<CreateGymClassTypeRequest> & { status?: GymResourceStatus };
