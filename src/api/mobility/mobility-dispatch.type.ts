import type { IsoDateTime } from '../../type/iso-date-time.type.js';
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
    pickupLatitude: number;
    pickupLongitude: number;
    expiresAt: IsoDateTime;
    /** Version of the dispatch state machine, not a worker or location version. */
    version: number;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/** `POST /api/v1/dispatches`; retry safety is supplied by the `Idempotency-Key` header. */
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
