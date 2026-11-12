import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { IveriProduct } from '../platform/iveri-product.enum.js';

import type { BillingInvoiceStatus } from './billing-invoice-status.enum.js';

/**
 * A plan's limits for one calendar month in UTC: a metric's name to the most the plan allows, or null for no limit. A
 * metric the plan does not name is not limited by it. Limits are data on the plan, edited like its price.
 */
export type UsageLimits = Record<string, Nullable<number>>;

/** A plan Iveri sells for a product, as a company reads it against its usage. */
export interface UsagePlan {
    id: UUID;
    code: string;
    name: string;
    product: IveriProduct;
    /** The price for one month, in the currency's minor unit. */
    amountMinor: number;
    currency: string;
    /**
     * True while the price and the limits are placeholders nobody has decided. Every screen that shows the plan says so
     * while it is true.
     */
    isPlaceholder: boolean;
    limits: UsageLimits;
}

/** One metric this month against the plan. */
export interface UsageMetricSummary {
    metric: string;
    quantity: number;
    /** The plan's limit, or null when the plan does not limit it. */
    limit: Nullable<number>;
}

/**
 * `GET /billing/usage/summary?product=` (a company's own) or `?tenantId=&product=` (behind `billing:usage:read-any`).
 * The period is the current calendar month in UTC, its end exclusive. `plan` is null when nothing is on sale for the
 * product, and then nothing is limited.
 */
export interface UsageSummary {
    tenantId: UUID;
    product: IveriProduct;
    periodStart: IsoDateTime;
    periodEnd: IsoDateTime;
    plan: Nullable<UsagePlan>;
    metrics: UsageMetricSummary[];
}

/** One line of an invoice, as it was when the invoice was issued. */
export interface UsageInvoiceLine {
    description: string;
    quantity: number;
    unitAmountMinor: number;
    amountMinor: number;
}

/**
 * An invoice as a company reads it. One built from a month's usage carries that month as its period; an invoice made
 * by hand carries none.
 */
export interface UsageInvoice {
    id: UUID;
    number: string;
    status: BillingInvoiceStatus;
    currency: string;
    totalMinor: number;
    periodStart: Nullable<IsoDateTime>;
    periodEnd: Nullable<IsoDateTime>;
    issuedAt: IsoDateTime;
    lines: UsageInvoiceLine[];
}

/**
 * `POST /billing/usage`. `tenantId` names the company the usage is for, and is refused with a 403 unless the token
 * holds `billing:usage:record-any` and comes from Iveri's operator workspace. Without it the usage is the token's own
 * company's. The `Idempotency-Key` header is unique per company the usage is for.
 */
export interface RecordUsageRequest {
    tenantId?: UUID;
    metric: string;
    periodStart: IsoDateTime;
    periodEnd: IsoDateTime;
    quantity: number;
    source: string;
}

/** `PUT /platform/usage-plans/:tenantId`: the plan a company is on for a product, from the next request on. */
export interface AssignUsagePlanRequest {
    product: IveriProduct;
    planCode: string;
}

/** Which plan a company is on for a product, and whether an operator chose it or it is the product's default. */
export interface UsagePlanAssignment {
    tenantId: UUID;
    product: IveriProduct;
    plan: UsagePlan;
    isDefault: boolean;
}

/**
 * Carried in the `details` of the 403 a product answers when a plan's limit refuses something, beside the product's
 * own reason, so a client can say which limit was reached.
 */
export const USAGE_LIMIT_REACHED_REASON = 'usage-limit-reached';

export interface UsageLimitReachedDetails {
    reason: typeof USAGE_LIMIT_REACHED_REASON;
    metric: string;
    limit: number;
}
