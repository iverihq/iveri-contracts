import type { CursorPage } from '../../type/cursor-page.type.js';
import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { DispatchStatus } from './dispatch-status.enum.js';

/**
 * One outbound request Conduit has accepted responsibility for.
 *
 * The inbound pipeline reversed: a vertical POSTs here, Conduit persists and answers `202`, and
 * the provider is called afterwards with retries and a dead-letter queue. The caller is released
 * from the third party's availability entirely — which is the point, because a CRM that awaits
 * the Graph API inline is a CRM that is down whenever Meta is.
 *
 * **The payload is stored as sent.** Conduit does not reshape it into a provider's format; §14
 * rules out transforms beyond header templating, and a gateway that rewrites bodies is a gateway
 * that has opinions about domains it must not know exist.
 */
export interface Dispatch {
    id: UUID;

    /** The connection this went out through. A loose reference — it may since have been deleted. */
    connectionId: UUID;

    /** Snapshotted, so the record still reads correctly after the connection is renamed. */
    connectionKey: string;
    connectorKey: string;

    /** The operation named at submit time. */
    operation: string;

    /** Optional FIFO lane. Dispatches in the same tenant and lane are claimed in creation order. */
    orderingKey: Nullable<string>;

    /**
     * Resolved when the dispatch was accepted, not read from the manifest now.
     *
     * Same rule as a delivery's target: editing an operation's path must not retroactively
     * change where Conduit says it sent something.
     */
    targetUrl: string;

    method: string;

    /**
     * The caller's own key, echoed back.
     *
     * Submitting twice with the same key returns the **first** dispatch rather than creating a
     * second — which is what makes a vertical's own retry safe. Null when the caller supplied
     * none, in which case a resubmit is a second send and that is the caller's choice.
     */
    idempotencyKey: Nullable<string>;

    status: DispatchStatus;
    attemptCount: number;

    /** Snapshotted from the connector's retry policy when accepted. */
    maxAttempts: number;

    nextAttemptAt: IsoDateTime;
    lastAttemptAt: Nullable<IsoDateTime>;

    /** Null when no response arrived. See `lastError`. */
    lastResponseStatus: Nullable<number>;

    lastResponseBodyPreview: Nullable<string>;
    lastError: Nullable<string>;

    /** Set when an operator redrove this. */
    redrivenByUserId: Nullable<UUID>;

    completedAt: Nullable<IsoDateTime>;
    createdAt: IsoDateTime;
}

/**
 * One attempt at one dispatch.
 *
 * `wasRateLimited` is the field that stops an operator misreading the history. A dispatch held
 * back by the connector's own limit did not fail, cost no attempt, and needs nothing done about
 * it — but without a record it looks like a gap in the timeline, and the obvious conclusion is
 * that the queue stalled.
 */
export interface DispatchAttempt {
    id: UUID;

    /** 1-based. Equal for two rows only when one of them was a rate-limit deferral. */
    attemptNumber: number;

    /** Null when no response arrived at all. */
    responseStatus: Nullable<number>;

    responseBodyPreview: Nullable<string>;
    errorMessage: Nullable<string>;
    durationMs: number;
    isSuccess: boolean;

    /** Recorded but not charged against the attempt budget. */
    wasRateLimited: boolean;

    /** Whether the access token was refreshed and the request re-sent within this attempt. */
    didRefreshCredentials: boolean;

    createdAt: IsoDateTime;
}

/** `GET /api/v1/dispatches/:id/attempts`. Oldest first — an attempt history reads as a story. */
export interface DispatchAttemptsList {
    items: DispatchAttempt[];
}

/** `GET /api/v1/dispatches`. Cursor-paginated: the collection is appended to while it is read. */
export type DispatchesPage = CursorPage<Dispatch>;

/** Query for `GET /api/v1/dispatches`. */
export interface GetDispatchesQuery {
    limit?: number;

    /** Opaque cursor from the previous page's `nextCursor`. Never parse it. */
    after?: Nullable<string>;

    /** `dead-lettered` is the DLQ view. The DLQ is a filter, not a separate resource. */
    status?: Nullable<DispatchStatus>;

    connectionId?: Nullable<UUID>;

    operation?: Nullable<string>;
}

/**
 * `POST /api/v1/dispatches` — the request a vertical makes to send something.
 *
 * Note what is **not** here: no URL, no host, no arbitrary headers. The caller picks a connection
 * and an operation, both of which someone configured deliberately, and Conduit derives the
 * target. Accepting a URL would make this an authenticated open proxy sitting inside our network.
 */
export interface SubmitDispatchBody {
    /** Which connection to send through, by its tenant-scoped key. */
    connectionKey: string;

    /** Which of the connector's operations to invoke, by key. */
    operation: string;

    /** Optional FIFO lane. Dispatches in the same tenant and lane wait for their predecessor. */
    orderingKey?: Nullable<string>;

    /** The request body, sent to the provider as-is. */
    payload: Record<string, unknown>;

    /**
     * Values for `{placeholders}` in the operation's path that the connection does not supply.
     *
     * Percent-encoded into the path, so a value cannot introduce a path segment or a query
     * string and steer the request at a different endpoint of the same host.
     */
    pathParams?: Nullable<Record<string, string>>;

    /** Appended to the resolved URL. Values are encoded. */
    query?: Nullable<Record<string, string>>;

    /**
     * The caller's idempotency key, scoped to the tenant.
     *
     * **Strongly recommended.** Without one, a vertical that times out submitting and retries
     * sends the customer two messages. With one, the second submit returns the first dispatch.
     */
    idempotencyKey?: Nullable<string>;
}

/**
 * `202 Accepted` from `POST /api/v1/dispatches`.
 *
 * Deliberately not the full {@link Dispatch}: at this moment the only true facts are that it was
 * accepted and where to look next. Returning a status the caller might treat as an outcome
 * invites exactly the synchronous coupling this endpoint exists to remove.
 */
export interface SubmitDispatchResponse {
    id: UUID;
    status: DispatchStatus;

    /** True when this submit matched an existing idempotency key and created nothing. */
    isDuplicate: boolean;

    createdAt: IsoDateTime;
}
