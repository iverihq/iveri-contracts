import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';

/**
 * Where a company's HR posts to Slack: one channel, through an incoming webhook the company's own Slack admin made.
 *
 * **The webhook address is never returned**, not masked and not truncated: it is the credential that posts into the
 * channel. `webhookHost` answers the only question an HR person has about it, which service it points at.
 */
export interface HrSlackChannel {
    isConnected: boolean;
    webhookHost: Nullable<string>;
    /** The language posts are written in: everybody in a channel reads the same message. */
    localeCode: string;
    /** A post when somebody's time off is agreed: who and when, never why. */
    postsApprovedTimeOff: boolean;
    /** A post every working morning naming who is away that day, or saying everybody is in. */
    postsDailyAbsences: boolean;
    /** `HH:mm` in the company's own time zone. */
    dailyPostTime: string;
    /** The last day a morning post went out, `YYYY-MM-DD` in the company's time zone. */
    lastDailyPostOn: Nullable<string>;
    /** When Slack last refused a post, so HR can tell a channel that stopped working from a quiet one. */
    lastFailedAt: Nullable<IsoDateTime>;
}

/**
 * Every field is optional and an omitted one keeps its value. `webhookUrl: null` disconnects the channel, and a new
 * address replaces the old one.
 */
export interface HrUpdateSlackChannelRequest {
    webhookUrl?: Nullable<string>;
    localeCode?: string;
    postsApprovedTimeOff?: boolean;
    postsDailyAbsences?: boolean;
    dailyPostTime?: string;
}
