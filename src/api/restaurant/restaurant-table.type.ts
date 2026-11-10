import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { RestaurantResourceStatus } from './restaurant-resource-status.enum.js';

/** A part of the room: the hall, the terrace, upstairs. */
export interface RestaurantFloorArea {
    id: UUID;
    branchId: UUID;
    name: LocalizedText;
    position: number;
    status: RestaurantResourceStatus;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateRestaurantFloorAreaRequest {
    branchId: UUID;
    name: LocalizedText;
    position?: number;
}

export interface UpdateRestaurantFloorAreaRequest {
    name?: LocalizedText;
    position?: number;
    status?: RestaurantResourceStatus;
}

export interface RestaurantTable {
    id: UUID;
    branchId: UUID;
    areaId: UUID;
    /** What is painted on the table: `12`, `T4`. */
    label: string;
    seats: number;
    position: number;
    status: RestaurantResourceStatus;
    /** What the printed code carries. Replacing it stops every printed copy working. */
    qrToken: string;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateRestaurantTableRequest {
    areaId: UUID;
    label: string;
    seats: number;
    position?: number;
}

export interface UpdateRestaurantTableRequest {
    areaId?: UUID;
    label?: string;
    seats?: number;
    position?: number;
    status?: RestaurantResourceStatus;
}
