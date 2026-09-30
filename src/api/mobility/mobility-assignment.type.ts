import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { MobilityAssignmentStatus } from './mobility-assignment-status.enum.js';

/**
 * The durable result of accepting a dispatch offer.
 *
 * A partial database unique constraint permits only one active assignment per dispatch. Worker
 * capacity is policy rather than a uniqueness rule so Delivery can later support bounded batching.
 * Releasing an assignment is a later explicit command; product completion never rewrites or
 * deletes this evidence.
 */
export interface MobilityAssignment {
    id: UUID;
    dispatchId: UUID;
    offerId: UUID;
    workerId: UUID;
    status: MobilityAssignmentStatus;
    assignedAt: IsoDateTime;
    releasedAt: Nullable<IsoDateTime>;
    /** Monotonic assignment aggregate version used for durable and realtime events. */
    version: number;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}
