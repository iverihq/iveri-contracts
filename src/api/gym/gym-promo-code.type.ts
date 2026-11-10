import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { GymResourceStatus } from './gym-resource-status.enum.js';

export interface GymPromoCode {
    id: UUID;
    /** Upper-case letters and digits, as somebody would type it. */
    code: string;
    discountPercent: number;
    startsOn: string;
    endsOn: string;
    /** Null means no limit. */
    maxRedemptions: Nullable<number>;
    redemptions: number;
    /** Empty means every plan. */
    planIds: UUID[];
    status: GymResourceStatus;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateGymPromoCodeRequest {
    code: string;
    discountPercent: number;
    startsOn: string;
    endsOn: string;
    maxRedemptions?: Nullable<number>;
    planIds?: UUID[];
}

export interface UpdateGymPromoCodeRequest {
    endsOn?: string;
    maxRedemptions?: Nullable<number>;
    status?: GymResourceStatus;
}
