import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { MobilityAvailabilityStatus } from './mobility-availability-status.enum.js';
import type { MobilityServiceType } from './mobility-service-type.enum.js';
import type { MobilityWorkerStatus } from './mobility-worker-status.enum.js';

/** Shared worker profile used by taxi and delivery dispatch. */
export interface MobilityWorker {
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
