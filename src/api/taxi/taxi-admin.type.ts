import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { Paginated } from '../../type/paginated.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { TaxiRideStatus } from './taxi-ride-status.enum.js';

/** A place as the passenger gave it. There is no address search, so it is coordinates only. */
export interface TaxiPoint {
    latitude: number;
    longitude: number;
}

/**
 * One ride as the company running the taxi service sees it on its board.
 *
 * The company sees its own customers' stops; Iveri's backoffice never does. A stop is null once the ride's location is
 * past the retention window, which differs from never having one. People are identifiers: the panel
 * names them from identity's public profile.
 */
export interface TaxiBoardRide {
    id: UUID;
    status: TaxiRideStatus;
    passengerUserId: UUID;
    /** The Mobility worker driving it, once a driver accepted. */
    driverWorkerId: Nullable<UUID>;
    /** The driver as a person; briefly null after acceptance while Taxi resolves the worker. */
    driverUserId: Nullable<UUID>;
    pickup: Nullable<TaxiPoint>;
    dropoff: Nullable<TaxiPoint>;
    /** A straight-line floor, never a final charge. */
    quotedFareMinor: number;
    quotedFareCurrency: string;
    quotedDistanceMeters: number;
    /** When the passenger wants collecting, for a ride booked ahead. */
    scheduledFor: Nullable<IsoDateTime>;
    createdAt: IsoDateTime;
    driverArrivingAt: Nullable<IsoDateTime>;
    startedAt: Nullable<IsoDateTime>;
    completedAt: Nullable<IsoDateTime>;
    cancelledAt: Nullable<IsoDateTime>;
}

/**
 * `GET /company/board?since=`: what is happening now, and what finished since `since` (the start of the company's
 * day, which only the panel knows). Each list is capped and newest first.
 */
export interface TaxiBoard {
    since: IsoDateTime;
    /** Looking for a driver, assigned, on the way, or carrying a passenger. Waiting quotes are not work yet. */
    active: TaxiBoardRide[];
    /** Completed, cancelled or expired since `since`. */
    finished: TaxiBoardRide[];
}

/** One driver's work since a moment, keyed by their Mobility worker. Workers with no rides are absent. */
export interface TaxiDriverActivity {
    workerId: UUID;
    completedRides: number;
    lastCompletedAt: Nullable<IsoDateTime>;
    /** The ride they are on now, if any. */
    activeRideId: Nullable<UUID>;
    activeRideStatus: Nullable<TaxiRideStatus>;
}

/** `GET /company/drivers/activity?since=`. */
export interface TaxiDriverActivityList {
    since: IsoDateTime;
    drivers: TaxiDriverActivity[];
}

/** Somebody who has asked this company for a ride. Named by the panel from identity. */
export interface TaxiPassengerSummary {
    userId: UUID;
    /** Every ride they asked for, including quotes they never accepted. */
    rides: number;
    completedRides: number;
    lastRideAt: IsoDateTime;
}

/** `GET /company/passengers`, most recent rider first. */
export type TaxiPassengersPage = Paginated<TaxiPassengerSummary>;

/**
 * What a quote costs: `base + round(metres × perKilometre / 1000)`, in minor units of `currency`. The distance is a
 * straight line, so the quote stays a floor whatever these are set to.
 */
export interface TaxiFareSettings {
    currency: string;
    baseFareMinor: number;
    perKilometreMinor: number;
    /** True while the company has never set its own prices and the service's defaults apply. */
    isDefault: boolean;
    updatedAt: Nullable<IsoDateTime>;
}

/** `PUT /company/fare-settings`. Applies to quotes made afterwards; a quote already given keeps its price. */
export interface UpdateTaxiFareSettingsRequest {
    currency: string;
    baseFareMinor: number;
    perKilometreMinor: number;
}

/** Quoted fares of a day's completed rides in one currency. Quoted, not earned: nothing settles a fare yet. */
export interface TaxiQuotedFareTotal {
    currency: string;
    quotedFareMinor: number;
}

/**
 * One day of the rides requested on it, in the report's time zone: how many were asked for, and how those ended.
 * A ride requested late and finished after midnight counts on the day it was asked for.
 */
export interface TaxiDailyTotals {
    /** `YYYY-MM-DD`. */
    date: string;
    requested: number;
    completed: number;
    cancelled: number;
    expired: number;
    /** Sum of the quoted fares of that day's completed rides, per currency. */
    completedQuotedFares: TaxiQuotedFareTotal[];
}

/** `GET /company/reports/daily?days=&timeZone=`: oldest day first, every day present, zeroes included. */
export interface TaxiDailyReport {
    timeZone: string;
    from: string;
    to: string;
    days: TaxiDailyTotals[];
}
