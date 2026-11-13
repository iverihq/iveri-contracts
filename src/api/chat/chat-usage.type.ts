import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { UsageInvoice, UsageSummary } from '../billing/usage.type.js';

/**
 * What Baasi meters for each app, as the metric names billing stores and a plan's limits name. A month is a calendar
 * month in UTC. Iveri's own product tenants, which are not apps, are not metered.
 */
export enum ChatUsageMetric {
    /** People who used the app at least once this month, each counted once. */
    MONTHLY_ACTIVE_USERS = 'chat.monthly-active-users',
    /** Messages somebody wrote this month. A product's or a group's own notices are not counted. */
    MESSAGES = 'chat.messages',
    /** Bytes of attachments stored this month. */
    STORED_BYTES = 'chat.stored-bytes',
}

/**
 * `GET /apps/:appId/usage`: the app's month against its plan, and the invoices built from its usage. `summary` is null
 * when billing could not be asked, which the console says rather than showing zeroes.
 */
export interface ChatAppUsage {
    appId: UUID;
    summary: Nullable<UsageSummary>;
    invoices: UsageInvoice[];
}
