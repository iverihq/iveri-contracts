import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { Paginated } from '../../type/paginated.type.js';
import type { UUID } from '../../type/uuid.type.js';

/**
 * A bounded set of keys owned by one consumer — `unibox-web`, `billing.invoice`, `messaging.otp`.
 *
 * **The unit of publish and the unit of fetch, and it has to be both.** Without namespaces every
 * consumer downloads every string the tenant has ever written, and a translator fixing one word in
 * an invoice template republishes the entire admin panel's UI at the same time. Those are the two
 * failures a flat key space produces, and neither is visible until the key count is in the
 * thousands and it is expensive to fix.
 *
 * A namespace maps roughly to a deployable: one app, or one family of server-rendered messages.
 */
export interface Namespace {
    id: UUID;

    /** Lowercase `[a-z0-9.-]`, e.g. `unibox-web`. Unique within the tenant. */
    key: string;

    /** What lives in here, for whoever has to decide where a new key belongs. */
    description: Nullable<string>;

    /**
     * Whether a release may include translations still in `draft`.
     *
     * Off by default. On for a namespace nobody reads in production yet, where requiring approval
     * on every key means a translator cannot see their own work in the app.
     */
    allowsDraftRelease: boolean;

    messageCount: number;

    /** Null until the namespace has been published once. */
    latestReleaseVersion: Nullable<number>;
    latestReleaseAt: Nullable<IsoDateTime>;

    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/** `GET /api/v1/namespaces`. */
export type NamespacesPage = Paginated<Namespace>;

/** `POST /api/v1/namespaces`. */
export interface CreateNamespaceBody {
    key: string;
    description?: Nullable<string>;
    allowsDraftRelease?: boolean;
}

/** `PATCH /api/v1/namespaces/:key`. The key itself is immutable — consumers pin it. */
export interface UpdateNamespaceBody {
    description?: Nullable<string>;
    allowsDraftRelease?: boolean;
}

/**
 * `GET /api/v1/namespaces/:key/progress` — how much is left to do, per locale.
 *
 * The one screen a translation project actually runs on. Answering it from the message listing
 * would mean paging through every key to count what is missing.
 */
export interface NamespaceProgress {
    namespaceKey: string;
    messageCount: number;
    locales: LocaleProgress[];
}

export interface LocaleProgress {
    localeCode: string;
    approved: number;
    needsReview: number;
    draft: number;
    missing: number;
}
