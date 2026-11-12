import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrWorkPlace } from './hr-work-place.enum.js';

/** One day of somebody's own week, planned or not. */
export interface HrMyWorkDay {
    date: string;
    /** One of the company's working weekdays and not a public holiday. */
    isWorkingDay: boolean;
    holidayName: Nullable<string>;
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
