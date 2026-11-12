import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrCalendarFeedKind } from './hr-calendar-feed-kind.enum.js';

/** A private address a calendar app subscribes to. The address itself is shown once, when it is made. */
export interface HrCalendarFeed {
    id: UUID;
    kind: HrCalendarFeedKind;
    teamId: Nullable<UUID>;
    teamName: Nullable<string>;
    /** The language leave types and public holidays are named in. */
    locale: string;
    createdAt: IsoDateTime;
    /** When a calendar app last fetched it, so a person can tell whether their subscription works. */
    lastReadAt: Nullable<IsoDateTime>;
}

/** A new address, which replaces any earlier one for the same calendar. */
export interface HrCalendarFeedCreated extends HrCalendarFeed {
    /** Relative to the API's versioned root, such as `calendar-feeds/<secret>/calendar.ics`. */
    path: string;
}

export interface HrCreateCalendarFeedRequest {
    kind: HrCalendarFeedKind;
    /** Required for a team's calendar, and refused for the others. */
    teamId?: Nullable<UUID>;
    locale: string;
}
