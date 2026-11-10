import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { RestaurantResourceStatus } from './restaurant-resource-status.enum.js';

/**
 * When a branch is open, as wall-clock times in its own zone. `dayOfWeek` is 0 for Sunday. A `closesAt`
 * at or before `opensAt` runs past midnight, as a bar's does.
 */
export interface RestaurantOpeningPeriod {
    dayOfWeek: number;
    opensAt: string;
    closesAt: string;
}

/** What a branch offers and how it runs. Each channel is off until somebody turns it on. */
export interface RestaurantBranchSettings {
    dineInEnabled: boolean;
    takeawayEnabled: boolean;
    deliveryEnabled: boolean;
    reservationsEnabled: boolean;
    /** Whether an order from a table waits for a waiter. On by default, because a table code is printed. */
    tableOrdersNeedConfirmation: boolean;
    /** Basis points on a dine-in bill: 1000 is 10%. */
    serviceChargeBasisPoints: number;
    takeawayPrepMinutes: number;
    deliveryPrepMinutes: number;
    /** Straight-line distance from the branch. */
    deliveryRadiusMeters: number;
    deliveryFeeMinor: number;
    deliveryMinimumOrderMinor: number;
    /** Null means delivery is never free. */
    deliveryFreeOverMinor: number | null;
    reservationSlotMinutes: number;
    reservationDurationMinutes: number;
    reservationLeadMinutes: number;
    reservationMaxPartySize: number;
    /** A ticket turns amber after this long. */
    kitchenWarnMinutes: number;
    /** A ticket turns red after this long. */
    kitchenLateMinutes: number;
    /** When the branch's day rolls over, for order numbers, the stop-list and takings. `05:00` by default. */
    businessDayEndsAt: string;
}

export interface RestaurantBranch extends RestaurantBranchSettings {
    id: UUID;
    name: LocalizedText;
    address: LocalizedText;
    city: LocalizedText;
    phone: string | null;
    latitude: number | null;
    longitude: number | null;
    timeZone: string;
    status: RestaurantResourceStatus;
    openingHours: RestaurantOpeningPeriod[];
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateRestaurantBranchRequest extends Partial<RestaurantBranchSettings> {
    name: LocalizedText;
    address: LocalizedText;
    city: LocalizedText;
    phone?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    timeZone: string;
    openingHours?: RestaurantOpeningPeriod[];
}

export interface UpdateRestaurantBranchRequest extends Partial<CreateRestaurantBranchRequest> {
    status?: RestaurantResourceStatus;
}
