import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { RestaurantChannel } from './restaurant-channel.enum.js';
import type { RestaurantDeliveryState } from './restaurant-delivery-state.enum.js';
import type { RestaurantOrderPaymentStatus } from './restaurant-order-payment-status.enum.js';
import type { RestaurantOrderStatus } from './restaurant-order-status.enum.js';
import type { RestaurantOrderLineRequest } from './restaurant-order.type.js';
import type { RestaurantPayWith } from './restaurant-pay-with.enum.js';

/** A pin on the map and the words a driver reads. There is no address search, so the pin is what counts. */
export interface RestaurantDeliveryAddress {
    address: string;
    details: string | null;
    latitude: number;
    longitude: number;
}

export interface RestaurantDeliveryAddressRequest {
    address: string;
    details?: string | null;
    latitude: number;
    longitude: number;
}

export interface PlaceRestaurantOrderRequest {
    branchId: UUID;
    /** Takeaway or delivery. A table's order goes through its code. */
    channel: RestaurantChannel;
    lines: RestaurantOrderLineRequest[];
    note?: string | null;
    /** When it should be ready. Null or absent means as soon as it can be. */
    requestedFor?: IsoDateTime | null;
    payWith: RestaurantPayWith;
    customerName: string;
    customerPhone: string;
    /** Required for delivery, refused otherwise. */
    deliveryAddress?: RestaurantDeliveryAddressRequest | null;
}

/** Everything the server would charge for a basket, before anybody commits to it. */
export interface RestaurantOrderQuoteRequest {
    branchId: UUID;
    channel: RestaurantChannel;
    lines: RestaurantOrderLineRequest[];
    deliveryAddress?: RestaurantDeliveryAddressRequest | null;
}

export interface RestaurantOrderQuote {
    subtotalMinor: number;
    discountMinor: number;
    deliveryFeeMinor: number;
    totalMinor: number;
    currency: string;
    /** Short of the branch's minimum for delivery. Null when it is met or does not apply. */
    shortOfMinimumMinor: number | null;
}

export interface RestaurantDinerOrderLineOption {
    optionId: UUID;
    groupName: LocalizedText;
    name: LocalizedText;
}

export interface RestaurantDinerOrderLine {
    itemId: UUID;
    name: LocalizedText;
    quantity: number;
    options: RestaurantDinerOrderLineOption[];
    note: string | null;
    /** What was charged, after any promotion. */
    lineTotalMinor: number;
    discountMinor: number;
}

/** An order as the person who placed it sees it. It names no staff, table, station or provider. */
export interface RestaurantDinerOrder {
    trackingToken: string;
    number: number;
    branchId: UUID;
    branchName: LocalizedText;
    branchAddress: LocalizedText;
    branchPhone: string | null;
    channel: RestaurantChannel;
    status: RestaurantOrderStatus;
    paymentStatus: RestaurantOrderPaymentStatus;
    deliveryState: RestaurantDeliveryState | null;
    deliveryAddress: RestaurantDeliveryAddress | null;
    customerName: string | null;
    note: string | null;
    requestedFor: IsoDateTime | null;
    /** When it is expected to be ready, for the diner to plan around. */
    expectedAt: IsoDateTime | null;
    subtotalMinor: number;
    discountMinor: number;
    deliveryFeeMinor: number;
    totalMinor: number;
    currency: string;
    lines: RestaurantDinerOrderLine[];
    placedAt: IsoDateTime;
    readyAt: IsoDateTime | null;
    completedAt: IsoDateTime | null;
    cancelledAt: IsoDateTime | null;
    /** Whether a checkout can still be opened for it. */
    canPay: boolean;
    /** Whether the person who placed it can still say how it was. */
    canReview: boolean;
}

export interface RestaurantOrderPlaced {
    order: RestaurantDinerOrder;
    /** Null when paying at the restaurant, or when the provider could not be reached yet. */
    checkoutUrl: string | null;
}

export interface RestaurantOrderCheckout {
    checkoutUrl: string;
}

export interface RestaurantDinerOrderPage {
    items: RestaurantDinerOrder[];
    total: number;
}

/** When an order can be ready. Every time offered falls in the branch's opening hours. */
export interface PublicRestaurantOrderTimes {
    channel: RestaurantChannel;
    isAccepting: boolean;
    isOpenNow: boolean;
    canOrderNow: boolean;
    /** The soonest it could be ready if ordered now. */
    earliestAt: IsoDateTime | null;
    times: IsoDateTime[];
}

export interface PublicRestaurantDeliveryQuote {
    isDeliverable: boolean;
    distanceMeters: number;
    feeMinor: number;
    minimumOrderMinor: number;
    freeOverMinor: number | null;
    prepMinutes: number;
    currency: string;
}
