import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';

export enum RestaurantServiceRequestKind {
    WAITER = 'waiter',
    BILL = 'bill',
}

/** A table asking for somebody. */
export interface RestaurantServiceRequest {
    id: UUID;
    branchId: UUID;
    tableId: UUID;
    tableLabel: string;
    kind: RestaurantServiceRequestKind;
    createdAt: IsoDateTime;
    resolvedAt: IsoDateTime | null;
}
