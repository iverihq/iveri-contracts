import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { RestaurantServiceRequest } from './restaurant-service-request.type.js';

/** The state of one table on the floor map. */
export interface RestaurantFloorTable {
    id: UUID;
    label: string;
    seats: number;
    /** The open bill, if somebody is sitting here. */
    billId: UUID | null;
    openedAt: IsoDateTime | null;
    totalMinor: number;
    /** Orders from this table waiting for a waiter to accept them. */
    ordersWaiting: number;
    /** Orders whose food is ready to carry over. */
    ordersReady: number;
    serviceRequests: RestaurantServiceRequest[];
}

export interface RestaurantFloorAreaView {
    id: UUID;
    name: LocalizedText;
    tables: RestaurantFloorTable[];
}

export interface RestaurantFloor {
    branchId: UUID;
    currency: string;
    areas: RestaurantFloorAreaView[];
}
