import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { RestaurantChannel } from './restaurant-channel.enum.js';
import type { RestaurantLineStatus } from './restaurant-line-status.enum.js';
import type { RestaurantOrderSource } from './restaurant-order-source.enum.js';
import type { RestaurantOrderStatus } from './restaurant-order-status.enum.js';

/** What was chosen on a line, as it was named and priced when ordered. */
export interface RestaurantOrderLineOption {
    optionId: UUID;
    groupName: LocalizedText;
    name: LocalizedText;
    priceDeltaMinor: number;
}

export interface RestaurantOrderLine {
    id: UUID;
    itemId: UUID;
    stationId: UUID;
    name: LocalizedText;
    quantity: number;
    unitPriceMinor: number;
    lineTotalMinor: number;
    options: RestaurantOrderLineOption[];
    note: string | null;
    status: RestaurantLineStatus;
    startedAt: IsoDateTime | null;
    readyAt: IsoDateTime | null;
    voidedAt: IsoDateTime | null;
    voidReason: string | null;
}

export interface RestaurantOrder {
    id: UUID;
    /** Per branch and business day, so a kitchen can call it across the room. */
    number: number;
    branchId: UUID;
    billId: UUID;
    tableId: UUID | null;
    tableLabel: string | null;
    channel: RestaurantChannel;
    source: RestaurantOrderSource;
    status: RestaurantOrderStatus;
    customerName: string | null;
    customerPhone: string | null;
    note: string | null;
    /** When it should be ready. Null means as soon as it can be. */
    requestedFor: IsoDateTime | null;
    subtotalMinor: number;
    currency: string;
    lines: RestaurantOrderLine[];
    placedAt: IsoDateTime;
    acceptedAt: IsoDateTime | null;
    readyAt: IsoDateTime | null;
    completedAt: IsoDateTime | null;
    cancelledAt: IsoDateTime | null;
    cancelReason: string | null;
    version: number;
}

/** What is being ordered. A client never sends a price. */
export interface RestaurantOrderLineRequest {
    itemId: UUID;
    quantity: number;
    optionIds?: UUID[];
    note?: string | null;
}

/** A waiter entering an order. */
export interface CreateRestaurantOrderRequest {
    branchId: UUID;
    channel: RestaurantChannel;
    /** Required for dine-in, refused otherwise. */
    tableId?: UUID | null;
    lines: RestaurantOrderLineRequest[];
    customerName?: string | null;
    customerPhone?: string | null;
    note?: string | null;
}

export interface CancelRestaurantOrderRequest {
    reason: string;
}

export interface VoidRestaurantOrderLineRequest {
    reason: string;
}
