import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { RestaurantChannel } from './restaurant-channel.enum.js';
import type { RestaurantResourceStatus } from './restaurant-resource-status.enum.js';

/** Money off by the day and the hour, which is what a happy hour is. */
export interface RestaurantPromotion {
    id: UUID;
    name: LocalizedText;
    description: LocalizedText | null;
    /** 2000 is 20% off. */
    percentBasisPoints: number;
    channels: RestaurantChannel[];
    /** Empty means every section of the menu. */
    categoryIds: UUID[];
    /** Empty means every branch. */
    branchIds: UUID[];
    /** Sunday is 0. Empty means every day. */
    daysOfWeek: number[];
    /** Null on both means all day. A window closing before it opens runs past midnight. */
    startsAtTime: string | null;
    endsAtTime: string | null;
    validFrom: string | null;
    validUntil: string | null;
    status: RestaurantResourceStatus;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface SaveRestaurantPromotionRequest {
    name: LocalizedText;
    description?: LocalizedText | null;
    percentBasisPoints: number;
    channels: RestaurantChannel[];
    categoryIds?: UUID[];
    branchIds?: UUID[];
    daysOfWeek?: number[];
    startsAtTime?: string | null;
    endsAtTime?: string | null;
    validFrom?: string | null;
    validUntil?: string | null;
    status?: RestaurantResourceStatus;
}

export interface PublicRestaurantPromotion {
    id: UUID;
    name: LocalizedText;
    description: LocalizedText | null;
    percentBasisPoints: number;
    channels: RestaurantChannel[];
    daysOfWeek: number[];
    startsAtTime: string | null;
    endsAtTime: string | null;
    validUntil: string | null;
}
