import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { RestaurantChannel } from './restaurant-channel.enum.js';
import type { RestaurantLineStatus } from './restaurant-line-status.enum.js';
import type { RestaurantOrderLineOption } from './restaurant-order.type.js';

export interface RestaurantKitchenLine {
    id: UUID;
    name: LocalizedText;
    quantity: number;
    options: RestaurantOrderLineOption[];
    note: string | null;
    status: RestaurantLineStatus;
    startedAt: IsoDateTime | null;
    readyAt: IsoDateTime | null;
}

/** What one station sees of one order. */
export interface RestaurantKitchenTicket {
    orderId: UUID;
    number: number;
    stationId: UUID;
    channel: RestaurantChannel;
    tableLabel: string | null;
    customerName: string | null;
    note: string | null;
    /** When the kitchen was given it. */
    acceptedAt: IsoDateTime;
    requestedFor: IsoDateTime | null;
    lines: RestaurantKitchenLine[];
}

/** How many of a dish are waiting, across every ticket. */
export interface RestaurantAllDayCount {
    itemId: UUID;
    name: LocalizedText;
    quantity: number;
}

export interface RestaurantKitchenBoard {
    branchId: UUID;
    warnMinutes: number;
    lateMinutes: number;
    tickets: RestaurantKitchenTicket[];
    /** Tickets just finished, so one can be called back. */
    recent: RestaurantKitchenTicket[];
    allDay: RestaurantAllDayCount[];
}

/** Moves every line of a ticket on together. */
export interface BumpRestaurantTicketRequest {
    stationId: UUID;
    status: RestaurantLineStatus.PREPARING | RestaurantLineStatus.READY;
}
