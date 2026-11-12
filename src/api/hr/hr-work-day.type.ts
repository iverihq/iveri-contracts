import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrWorkPlace } from './hr-work-place.enum.js';
import type { LocalizedText } from './localized-text.type.js';

/** One day of somebody's own week, planned or not. */
export interface HrMyWorkDay {
    date: string;
    /** One of the company's working weekdays and not a public holiday. */
    isWorkingDay: boolean;
    holidayName: Nullable<LocalizedText>;
    /** Time off, agreed or waiting, covers it. */
    isAway: boolean;
    /** Null until the person says where they will work. */
    place: Nullable<HrWorkPlace>;
    /** The office, on an office day. */
    locationId: Nullable<UUID>;
    locationName: Nullable<string>;
}

/** An office somebody can say they will work at. */
export interface HrWorkOffice {
    id: UUID;
    name: string;
    city: Nullable<string>;
}

/** Somebody's own plan for a stretch of days, with what they need to make it. */
export interface HrMyWorkDays {
    from: string;
    to: string;
    /** How many days in one Monday-to-Sunday week the company lets somebody work from home, or null for no limit. */
    homeDaysPerWeek: Nullable<number>;
    /** The office a day is placed at when the person names none. */
    defaultLocationId: Nullable<UUID>;
    offices: HrWorkOffice[];
    days: HrMyWorkDay[];
}

export interface HrSaveWorkDayRequest {
    place: HrWorkPlace;
    /** Which office, on an office day. Left out, it is the person's own office; a home day names none. */
    locationId?: Nullable<UUID>;
}

/** Somebody who has said where they will work on a day. */
export interface HrWorkDayPerson {
    employeeId: UUID;
    name: string;
    jobTitle: Nullable<string>;
}

/** Everybody who will be at one office on a day. An office day with no office named has a null location. */
export interface HrWorkDayOffice {
    locationId: Nullable<UUID>;
    locationName: Nullable<string>;
    people: HrWorkDayPerson[];
}

/**
 * Who has said where they will work on a day, by office, and who will be at home. Nobody away that day is in it, and
 * nobody who has not said.
 */
export interface HrWhoIsIn {
    date: string;
    offices: HrWorkDayOffice[];
    home: HrWorkDayPerson[];
}

/** An office in HR's occupancy view, with its desks when HR has counted them. */
export interface HrOccupancyOffice {
    id: UUID;
    name: string;
    city: Nullable<string>;
    deskCount: Nullable<number>;
}

/** How many people said they will be at one office on a day. A null office is people with no office of their own. */
export interface HrOccupancyCount {
    locationId: Nullable<UUID>;
    count: number;
}

/**
 * One day of HR's occupancy view, counting everybody on the staff list that day. Each person is in exactly one of:
 * an office, home, away (agreed time off takes the whole day) or unsaid. A day nobody works counts nobody as unsaid.
 */
export interface HrOccupancyDay {
    date: string;
    isWorkingDay: boolean;
    holidayName: Nullable<LocalizedText>;
    offices: HrOccupancyCount[];
    home: number;
    away: number;
    unsaid: number;
}

/** Where the company's people said they will work over a stretch of days, as counts. */
export interface HrOfficeOccupancy {
    from: string;
    to: string;
    offices: HrOccupancyOffice[];
    days: HrOccupancyDay[];
}
