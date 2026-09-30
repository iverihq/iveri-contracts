import type { CursorPage } from '../../type/cursor-page.type.js';
import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { MobilityAssignment } from './mobility-assignment.type.js';
import type { MobilityDispatchOfferStatus } from './mobility-dispatch-offer-status.enum.js';
import type { MobilityDispatch } from './mobility-dispatch.type.js';

/**
 * A time-bounded invitation for one eligible worker to accept one dispatch.
 *
 * The record contains identifiers and lifecycle evidence only. Product details remain in Taxi or
 * Delivery, and no worker coordinate is copied into an offer or exposed through realtime.
 */
export interface MobilityDispatchOffer {
    id: UUID;
    dispatchId: UUID;
    workerId: UUID;
    status: MobilityDispatchOfferStatus;
    expiresAt: IsoDateTime;
    respondedAt: Nullable<IsoDateTime>;
    /** Monotonic offer aggregate version used for optimistic clients and durable events. */
    version: number;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/** `GET /api/v1/dispatch-offers`; always scoped to the authenticated caller's worker profile. */
export interface GetMobilityDispatchOffersQuery {
    limit?: number;
    /** Opaque cursor from the previous page's `nextCursor`. Never parse it. */
    after?: Nullable<string>;
    status?: Nullable<MobilityDispatchOfferStatus>;
}

export type MobilityDispatchOffersPage = CursorPage<MobilityDispatchOffer>;

/**
 * `POST /api/v1/dispatch-offers/:offerId/accept`.
 *
 * The command has no body: the offer identifies both the dispatch and worker, while the tenant and
 * person come from authentication. Retry safety is supplied by the required `Idempotency-Key`
 * header. Acceptance either returns the one committed assignment or changes nothing.
 */
export interface AcceptMobilityDispatchOfferResponse {
    offer: MobilityDispatchOffer;
    dispatch: MobilityDispatch;
    assignment: MobilityAssignment;
    isDuplicate: boolean;
}

/**
 * `POST /api/v1/dispatch-offers/:offerId/reject`; retry safety is supplied by the required
 * `Idempotency-Key` header.
 */
export interface RejectMobilityDispatchOfferResponse {
    offer: MobilityDispatchOffer;
    isDuplicate: boolean;
}
