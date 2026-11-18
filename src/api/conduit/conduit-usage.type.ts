import type { Nullable } from '../../type/nil.type.js';
import type { UsageInvoice, UsageSummary } from '../billing/usage.type.js';

/**
 * What Conduit meters for each company, as the metric names billing stores and a plan's limits name. A month is a
 * calendar month in UTC.
 *
 * **Counted, never enforced.** Refusing a provider's webhook because a plan ran out loses that company's data — the
 * provider gives up after its own retries — so whether and how an ingress gateway stops at a limit is a product
 * decision nobody has made. Until it is, a plan's limits for these metrics are shown and nothing refuses on them.
 */
export enum ConduitUsageMetric {
    /** Webhooks a provider posted to one of the company's ingress endpoints, whatever became of them. */
    WEBHOOKS_RECEIVED = 'conduit.webhooks-received',
    /** Deliveries a destination accepted: a webhook forwarded once per destination that took it. */
    DELIVERIES_FORWARDED = 'conduit.deliveries-forwarded',
    /** Dispatches a third-party API accepted on the company's behalf. */
    DISPATCHES_SENT = 'conduit.dispatches-sent',
}

/**
 * `GET /usage`: the company's month against its Conduit plan, and the invoices built from its usage. `summary` is null
 * when billing could not be asked, which the panel says rather than showing zeroes.
 */
export interface ConduitUsage {
    summary: Nullable<UsageSummary>;
    invoices: UsageInvoice[];
}
