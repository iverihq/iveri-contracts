import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { RestaurantReviewStatus } from './restaurant-review-status.enum.js';

export interface RestaurantReview {
    id: UUID;
    orderId: UUID;
    authorName: string;
    rating: number;
    comment: string | null;
    status: RestaurantReviewStatus;
    reply: string | null;
    repliedAt: IsoDateTime | null;
    createdAt: IsoDateTime;
}

export interface RestaurantReviewPage {
    items: RestaurantReview[];
    total: number;
}

/** Only somebody whose order was completed can write one. */
export interface SubmitRestaurantReviewRequest {
    trackingToken: string;
    rating: number;
    comment?: string | null;
}

export interface ReplyRestaurantReviewRequest {
    reply: string | null;
}

export interface PublicRestaurantReview {
    id: UUID;
    authorName: string;
    rating: number;
    comment: string | null;
    reply: string | null;
    createdAt: IsoDateTime;
}

export interface PublicRestaurantReviews {
    /** Null until somebody has been published, never zero. */
    averageRating: number | null;
    count: number;
    items: PublicRestaurantReview[];
}
