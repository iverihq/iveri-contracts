import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { RestaurantReservationSource } from './restaurant-reservation-source.enum.js';
import type { RestaurantReservationStatus } from './restaurant-reservation-status.enum.js';

export interface RestaurantReservationTable {
    id: UUID;
    label: string;
    seats: number;
}

export interface RestaurantReservation {
    id: UUID;
    branchId: UUID;
    status: RestaurantReservationStatus;
    source: RestaurantReservationSource;
    startsAt: IsoDateTime;
    endsAt: IsoDateTime;
    partySize: number;
    customerId: UUID | null;
    customerName: string;
    customerPhone: string | null;
    note: string | null;
    tables: RestaurantReservationTable[];
    seatedAt: IsoDateTime | null;
    completedAt: IsoDateTime | null;
    cancelledAt: IsoDateTime | null;
    cancelReason: string | null;
    createdAt: IsoDateTime;
    version: number;
}

/** Staff taking a booking by phone, or sitting somebody who walked in. */
export interface CreateRestaurantReservationRequest {
    branchId: UUID;
    startsAt: IsoDateTime;
    partySize: number;
    customerName: string;
    customerPhone?: string | null;
    note?: string | null;
    /** Left out, the smallest free table that fits is taken. Several are pushed together. */
    tableIds?: UUID[];
    isWalkIn?: boolean;
}

export interface UpdateRestaurantReservationRequest {
    startsAt?: IsoDateTime;
    partySize?: number;
    customerName?: string;
    customerPhone?: string | null;
    note?: string | null;
    tableIds?: UUID[];
}

export interface CancelRestaurantReservationRequest {
    reason?: string | null;
}

export interface PublicRestaurantReservationSlots {
    date: string;
    partySize: number;
    /** The largest party that can book online. A bigger one is told to call. */
    maxPartySize: number;
    slots: IsoDateTime[];
}

export interface BookMyRestaurantReservationRequest {
    branchId: UUID;
    startsAt: IsoDateTime;
    partySize: number;
    note?: string | null;
}

export interface MyRestaurantReservation {
    id: UUID;
    branchId: UUID;
    branchName: LocalizedText;
    branchAddress: LocalizedText;
    status: RestaurantReservationStatus;
    startsAt: IsoDateTime;
    endsAt: IsoDateTime;
    partySize: number;
    note: string | null;
    canCancel: boolean;
}
