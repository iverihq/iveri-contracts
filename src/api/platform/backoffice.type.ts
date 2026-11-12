import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { Paginated } from '../../type/paginated.type.js';
import type { UUID } from '../../type/uuid.type.js';

/**
 * One number a product reports about a company, or about all of them. `key` is a stable, lower-case word the
 * product's backoffice turns into a label (`people`, `bookings`, `orders`), so a product adds a figure without a
 * contracts release.
 */
export interface BackofficeMetric {
    key: string;
    value: number;
}

/** A product's totals across every company that uses it. */
export interface BackofficeOverview {
    tenantCount: number;
    metrics: BackofficeMetric[];
}

/** One company as a product sees it: its figures and when it last did anything. Names come from identity. */
export interface BackofficeTenantSummary {
    tenantId: UUID;
    metrics: BackofficeMetric[];
    lastActivityAt: Nullable<IsoDateTime>;
}

export type BackofficeTenantsPage = Paginated<BackofficeTenantSummary>;

/**
 * A record support may need to see, read-only: an order, a booking, a ride, an employee. `kind` and `status` are
 * stable words the backoffice labels; `title` is the company's own text (a name, a number) and is shown as written.
 * Never pay, identity numbers, health records or the words of a message.
 */
export interface BackofficeRecord {
    id: UUID;
    kind: string;
    title: string;
    status: Nullable<string>;
    at: IsoDateTime;
}

export interface BackofficeTenantDetail {
    tenantId: UUID;
    metrics: BackofficeMetric[];
    lastActivityAt: Nullable<IsoDateTime>;
    /** The newest records, at most 50. */
    recent: BackofficeRecord[];
}
