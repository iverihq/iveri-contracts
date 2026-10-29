import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { MobilityAvailabilityStatus } from './mobility-availability-status.enum.js';
import type { MobilityServiceType } from './mobility-service-type.enum.js';
import type { MobilityWorkerReputation } from './mobility-worker-rating.type.js';
import type { MobilityWorkerStatus } from './mobility-worker-status.enum.js';

/**
 * Shared worker profile used by taxi and delivery dispatch.
 *
 * It extends {@link MobilityWorkerReputation} rather than carrying a separate route, because
 * every caller that wants a worker's standing already holds `mobility:worker:read` and is
 * already reading this row — a second endpoint would be a second request and a second permission
 * question for two columns sitting on the row the first one returned.
 */
export interface MobilityWorker extends MobilityWorkerReputation {
    id: UUID;
    /** Identity user represented by this worker. Unique within a tenant. */
    userId: UUID;
    serviceTypes: MobilityServiceType[];
    status: MobilityWorkerStatus;
    availability: MobilityAvailabilityStatus;
    /** Monotonic aggregate version used by events and optimistic clients. */
    version: number;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/** `POST /api/v1/workers`; retry safety is supplied by the `Idempotency-Key` header. */
export interface CreateMobilityWorkerBody {
    userId: UUID;
    serviceTypes: MobilityServiceType[];
}

export interface CreateMobilityWorkerResponse {
    worker: MobilityWorker;
    isDuplicate: boolean;
}

/** Administrative changes. Availability has a separate least-privilege endpoint. */
export interface UpdateMobilityWorkerBody {
    serviceTypes?: MobilityServiceType[];
    status?: MobilityWorkerStatus;
}

/** Humans may request only these states; `busy` is assignment-owned. */
export interface SetMobilityWorkerAvailabilityBody {
    availability: MobilityAvailabilityStatus.AVAILABLE | MobilityAvailabilityStatus.OFFLINE;
}

/**
 * A worker's most recently accepted device position.
 *
 * Coordinates are deliberately an API response only where a caller holds the separate location
 * permission. Realtime carries only this worker id and an aggregate version; it never carries
 * these fields.
 */
export interface MobilityWorkerLocation {
    workerId: UUID;
    latitude: number;
    longitude: number;
    accuracyMeters: number;
    capturedAt: IsoDateTime;
    receivedAt: IsoDateTime;
    /** Monotonic per-worker device sequence; older samples are rejected, not silently reordered. */
    sequence: number;
}

/**
 * A device heartbeat for the caller's own worker profile.
 *
 * `receivedAt` and the location source are server-owned evidence. A client cannot backdate its
 * server receipt or claim that a manual coordinate was GPS-derived.
 */
export interface UpdateMobilityWorkerLocationBody {
    latitude: number;
    longitude: number;
    accuracyMeters: number;
    capturedAt: IsoDateTime;
    sequence: number;
}
