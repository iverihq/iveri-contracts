import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { Paginated } from '../../type/paginated.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { DeliveryJobStatus } from './delivery-job-status.enum.js';

/** A stop as the sender gave it. There is no address search, so it is coordinates only. */
export interface DeliveryPoint {
    latitude: number;
    longitude: number;
}

/**
 * One job as the company running the delivery service sees it on its board.
 *
 * The company sees its own customers' stops; Iveri's backoffice never does. A stop is null once the job's location is
 * past the retention window, which differs from never having one. People are identifiers: the panel names them from
 * identity's public profile.
 */
export interface DeliveryBoardJob {
    id: UUID;
    status: DeliveryJobStatus;
    /** Null when the company asked for the delivery itself, as a shop shipping its own orders does. */
    senderUserId: Nullable<UUID>;
    /** The Mobility worker carrying it, once a courier accepted. */
    courierWorkerId: Nullable<UUID>;
    /** The courier as a person; briefly null after acceptance while Delivery resolves the worker. */
    courierUserId: Nullable<UUID>;
    pickup: Nullable<DeliveryPoint>;
    dropoff: Nullable<DeliveryPoint>;
    /** A straight-line floor, never a final charge. */
    quotedFeeMinor: number;
    quotedFeeCurrency: string;
    quotedDistanceMeters: number;
    createdAt: IsoDateTime;
    assignedAt: Nullable<IsoDateTime>;
    pickedUpAt: Nullable<IsoDateTime>;
    inTransitAt: Nullable<IsoDateTime>;
    deliveredAt: Nullable<IsoDateTime>;
    cancelledAt: Nullable<IsoDateTime>;
    /** Whether the courier left proof. The photograph itself is private evidence and is never on the board. */
    hasProof: boolean;
    /** The name the courier entered for whoever took the parcel; null without proof or past its retention window. */
    recipientName: Nullable<string>;
}

/**
 * `GET /company/board?since=`: what is happening now, and what finished since `since` (the start of the company's
 * day, which only the panel knows). Each list is capped and newest first.
 */
export interface DeliveryBoard {
    since: IsoDateTime;
    /** Looking for a courier, assigned, picked up or in transit. Waiting quotes are not work yet. */
    active: DeliveryBoardJob[];
    /** Delivered, cancelled, expired, quote-expired or failed since `since`. */
    finished: DeliveryBoardJob[];
}

/** One courier's work since a moment, keyed by their Mobility worker. Couriers with no jobs are absent. */
export interface DeliveryCourierActivity {
    workerId: UUID;
    deliveredJobs: number;
    lastDeliveredAt: Nullable<IsoDateTime>;
    /** The job they are carrying now, if any. */
    activeJobId: Nullable<UUID>;
    activeJobStatus: Nullable<DeliveryJobStatus>;
}

/** `GET /company/couriers/activity?since=`. */
export interface DeliveryCourierActivityList {
    since: IsoDateTime;
    couriers: DeliveryCourierActivity[];
}

/**
 * Somebody who has asked this company to carry something. Named by the panel from identity. Jobs the company asked
 * for itself have no sender and are not anybody's here.
 */
export interface DeliverySenderSummary {
    userId: UUID;
    /** Every job they asked for, including quotes they never accepted. */
    jobs: number;
    deliveredJobs: number;
    lastJobAt: IsoDateTime;
}

/** `GET /company/senders`, most recent sender first. */
export type DeliverySendersPage = Paginated<DeliverySenderSummary>;

/**
 * What a quote costs: `base + round(metres × perKilometre / 1000)`, in minor units of `currency`. The distance is a
 * straight line, so the quote stays a floor whatever these are set to.
 */
export interface DeliveryFeeSettings {
    currency: string;
    baseFeeMinor: number;
    perKilometreMinor: number;
    /** True while the company has never set its own prices and the service's defaults apply. */
    isDefault: boolean;
    updatedAt: Nullable<IsoDateTime>;
}

/** `PUT /company/fee-settings`. Applies to quotes made afterwards; a quote already given keeps its price. */
export interface UpdateDeliveryFeeSettingsRequest {
    currency: string;
    baseFeeMinor: number;
    perKilometreMinor: number;
}

/** Quoted fees of a day's delivered jobs in one currency. Quoted, not earned: nothing settles a fee yet. */
export interface DeliveryQuotedFeeTotal {
    currency: string;
    quotedFeeMinor: number;
}

/**
 * One day of the jobs requested on it, in the report's time zone: how many were asked for, and how those ended. A job
 * requested late and delivered after midnight counts on the day it was asked for.
 */
export interface DeliveryDailyTotals {
    /** `YYYY-MM-DD`. */
    date: string;
    requested: number;
    delivered: number;
    cancelled: number;
    /** No courier was found, or the sender let the quote run out. */
    expired: number;
    /** Mobility refused the request: a fault on Iveri's side rather than the company's. */
    failed: number;
    /** Sum of the quoted fees of that day's delivered jobs, per currency. */
    deliveredQuotedFees: DeliveryQuotedFeeTotal[];
}

/** `GET /company/reports/daily?days=&timeZone=`: oldest day first, every day present, zeroes included. */
export interface DeliveryDailyReport {
    timeZone: string;
    from: string;
    to: string;
    days: DeliveryDailyTotals[];
}
