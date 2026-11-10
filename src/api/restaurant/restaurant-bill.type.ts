import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { RestaurantBillStatus } from './restaurant-bill-status.enum.js';
import type { RestaurantChannel } from './restaurant-channel.enum.js';
import type { RestaurantOrder } from './restaurant-order.type.js';
import type { RestaurantPaymentMethod } from './restaurant-payment-method.enum.js';

export interface RestaurantPayment {
    id: UUID;
    billId: UUID;
    method: RestaurantPaymentMethod;
    /** Negative for a refund. */
    amountMinor: number;
    tipMinor: number;
    /** The payment a refund gives back. */
    refundOfId: UUID | null;
    note: string | null;
    recordedByUserId: UUID | null;
    createdAt: IsoDateTime;
}

/** What a table has run up, or what one takeaway adds up to. */
export interface RestaurantBill {
    id: UUID;
    branchId: UUID;
    tableId: UUID | null;
    tableLabel: string | null;
    channel: RestaurantChannel;
    status: RestaurantBillStatus;
    currency: string;
    subtotalMinor: number;
    serviceChargeBasisPoints: number;
    serviceChargeMinor: number;
    deliveryFeeMinor: number;
    discountMinor: number;
    totalMinor: number;
    /** Net of refunds. */
    paidMinor: number;
    /** What is still owing, never below zero. */
    balanceMinor: number;
    tipMinor: number;
    orders: RestaurantOrder[];
    payments: RestaurantPayment[];
    openedAt: IsoDateTime;
    closedAt: IsoDateTime | null;
}

/** A bill as a line in a list. */
export interface RestaurantBillSummary {
    id: UUID;
    branchId: UUID;
    tableLabel: string | null;
    channel: RestaurantChannel;
    status: RestaurantBillStatus;
    currency: string;
    totalMinor: number;
    paidMinor: number;
    balanceMinor: number;
    openedAt: IsoDateTime;
    closedAt: IsoDateTime | null;
}

export interface RecordRestaurantPaymentRequest {
    method: RestaurantPaymentMethod.CASH | RestaurantPaymentMethod.CARD;
    amountMinor: number;
    tipMinor?: number;
    note?: string | null;
}

export interface RefundRestaurantPaymentRequest {
    amountMinor: number;
    reason: string;
}

/** One way of paying over a day. Refunds are netted out, so `cash` is what the drawer should hold. */
export interface RestaurantTakingsByMethod {
    method: RestaurantPaymentMethod;
    amountMinor: number;
    tipMinor: number;
    count: number;
}

export interface RestaurantDailyTakings {
    branchId: UUID;
    /** The business day, in the branch's own calendar. */
    date: string;
    currency: string;
    totalMinor: number;
    tipMinor: number;
    byMethod: RestaurantTakingsByMethod[];
    refundsMinor: number;
    billsSettled: number;
    /** Bills from that day still owing something. */
    billsOpen: number;
    openBalanceMinor: number;
}

export interface RestaurantSalesByChannel {
    channel: RestaurantChannel;
    orderCount: number;
    salesMinor: number;
}

export interface RestaurantSalesByItem {
    itemId: UUID;
    name: Record<string, string>;
    quantity: number;
    salesMinor: number;
}

export interface RestaurantSalesByHour {
    /** In the branch's zone, 0 to 23. */
    hour: number;
    orderCount: number;
    salesMinor: number;
}

export interface RestaurantSalesByDay {
    date: string;
    orderCount: number;
    salesMinor: number;
}

export interface RestaurantSalesReport {
    branchId: UUID;
    from: string;
    to: string;
    currency: string;
    orderCount: number;
    salesMinor: number;
    averageOrderMinor: number;
    byChannel: RestaurantSalesByChannel[];
    byDay: RestaurantSalesByDay[];
    byHour: RestaurantSalesByHour[];
    topItems: RestaurantSalesByItem[];
}
