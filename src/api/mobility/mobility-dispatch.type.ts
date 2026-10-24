import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { MobilityDispatchStatus } from './mobility-dispatch-status.enum.js';
import type { MobilityServiceType } from './mobility-service-type.enum.js';

/**
 * A provider-neutral request to find a worker for one vertical-owned resource.
 *
 * `subjectId` is opaque to Mobility: taxi owns a ride and delivery owns a job. Keeping it an id
 * rather than copying either record prevents a generic dispatch table from becoming product state.
 */
export interface MobilityDispatch {
    id: UUID;
    serviceType: MobilityServiceType;
    subjectId: UUID;
    status: MobilityDispatchStatus;
    /**
     * `null` once the dispatch is past Mobility's location retention window.
     *
     * **Nullable because it is redacted, not because it is optional** —
     * `CreateMobilityDispatchBody` below still requires both, and a dispatch cannot exist without
     * them. Mobility strips them from a terminal dispatch and keeps the row, because the
     * assignment hanging off it is a worker's evidence of a job they did.
     *
     * This is the half of the products' own retention promise that lives here: Taxi and Delivery
     * expire a ride's and a job's coordinates, and **the pickup survived in this table keyed by
     * the same `subjectId`** until this window existed. A reader that holds this value past a
     * product's window is holding what that product has already deleted.
     *
     * Both move together, so a consumer that can render one can render both.
     */
    pickupLatitude: Nullable<number>;
    pickupLongitude: Nullable<number>;
    expiresAt: IsoDateTime;
    /** Version of the dispatch state machine, not a worker or location version. */
    version: number;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/**
 * `POST /api/v1/dispatches`; retry safety is supplied by the `Idempotency-Key` header.
 *
 * The two coordinates are **required here and nullable on `MobilityDispatch`**, deliberately: the
 * request and the response are the same fields with opposite nullability, and widening this one so
 * the two could share a type would let a caller submit a dispatch with nowhere to search from.
 */
export interface CreateMobilityDispatchBody {
    serviceType: MobilityServiceType;
    subjectId: UUID;
    pickupLatitude: number;
    pickupLongitude: number;
}

export interface CreateMobilityDispatchResponse {
    dispatch: MobilityDispatch;
    isDuplicate: boolean;
}
