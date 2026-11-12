import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

/**
 * One company's workers of one service type, for a product's backoffice. Counts only: who they are stays with the
 * company.
 */
export interface MobilityBackofficeWorkerCount {
    tenantId: UUID;
    /** Enrolled workers, suspended ones included. */
    workers: number;
    /** Active workers who are available or busy right now. */
    onShift: number;
    /** When any of them last changed, which is how a product dates the company's last activity. */
    lastChangedAt: Nullable<IsoDateTime>;
}

/** `GET /api/v1/backoffice/workers?serviceType=`: every company with a worker of that type. */
export interface MobilityBackofficeWorkerCounts {
    items: MobilityBackofficeWorkerCount[];
}
