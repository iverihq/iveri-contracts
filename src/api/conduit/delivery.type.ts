import type { CursorPage } from '../../type/cursor-page.type.js';
import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { DeliveryStatus } from './delivery-status.enum.js';

/** One capture on its way to one destination. */
export interface Delivery {
    id: UUID;
    captureId: UUID;

    /** The route that matched. May since have been deleted — the reference is loose. */
    routeId: UUID;

    destinationId: UUID;

    /**
     * Snapshotted when the delivery was enqueued, not read from the destination now: "we sent it
     * here" must not silently become "we sent it wherever that points today".
     */
    targetUrl: string;

    method: string;

    /**
     * Sent as `Idempotency-Key`, stable across every retry and every redrive.
     *
     * **At-least-once is the only guarantee Conduit offers.** A timeout that actually succeeded,
     * a replica that died after the request landed, and an operator redriving a dead letter all
     * arrive with the same key — a receiver must dedupe on it.
     */
    idempotencyKey: string;

    status: DeliveryStatus;
    attemptCount: number;

    /** Snapshotted from the destination when enqueued. */
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
 * One attempt at one delivery.
 *
 * What makes a dead letter diagnosable: "timed out, 502, 502, 401" is a different afternoon from
 * "failed after 5 attempts", and the difference is whether the receiver was down or the
 * credential is wrong.
 */
export interface DeliveryAttempt {
    id: UUID;

    /** 1-based. */
    attemptNumber: number;

    /** Null when no response arrived at all. */
    responseStatus: Nullable<number>;

    responseBodyPreview: Nullable<string>;
    errorMessage: Nullable<string>;

    /** Wall time, so a receiver that is slow rather than broken is visible. */
    durationMs: number;

    isSuccess: boolean;
    createdAt: IsoDateTime;
}

/** `GET /api/v1/deliveries/:id/attempts`. Oldest first — an attempt history reads as a story. */
export interface DeliveryAttemptsList {
    items: DeliveryAttempt[];
}

/** `GET /api/v1/deliveries`. Cursor-paginated: the collection is appended to while it is read. */
export type DeliveriesPage = CursorPage<Delivery>;

/** Query for `GET /api/v1/deliveries`. */
export interface GetDeliveriesQuery {
    limit?: number;

    /** Opaque cursor from the previous page's `nextCursor`. Never parse it. */
    after?: Nullable<string>;

    /** `dead-lettered` is the DLQ view. The DLQ is a filter, not a separate resource. */
    status?: Nullable<DeliveryStatus>;

    destinationId?: Nullable<UUID>;

    /** Everything one capture fanned out to. */
    captureId?: Nullable<UUID>;
}

/**
 * `GET /api/v1/deliveries/stats`.
 *
 * **The split between the two halves is the whole design, and it is not a presentation choice.**
 * A count is only as cheap as the set it scans, and "all time" is affordable only for a set
 * something else keeps small — so the backlog is counted over all time because the processor and
 * the retention sweep bound it, while throughput is counted over a window because nothing bounds
 * the delivered rows.
 *
 * It is also the honest reading for an operator: a dead letter from three days ago is still
 * somebody's data that never arrived, and windowing it would quietly retire the problem.
 */
export interface DeliveryStats {
    /** Deliveries still waiting on something, over all time. */
    backlog: DeliveryBacklog;

    /** How far back {@link DeliveryStats.recent} reaches. Fixed by the service. */
    windowHours: number;

    recent: DeliveryThroughput;
}

export interface DeliveryBacklog {
    /** Queued, including rows waiting out a backoff. */
    pending: number;

    /** Claimed by a replica and being attempted. */
    inFlight: number;

    /**
     * Out of attempts. Terminal until an operator redrives one, so this number does not come
     * down on its own — which is exactly why it is the first thing a dashboard shows.
     */
    deadLettered: number;
}

/**
 * Deliveries **created** in the window, by the state they are in now.
 *
 * Created, rather than finished, because `created_at` is indexed and the terminal transition is
 * not — and `updated_at` would not answer the question either, since a redrive touches it too. A
 * delivery's whole life is one attempt budget of capped, jittered backoff, so the only rows this
 * misplaces are the handful created in the half hour before the window opened.
 */
export interface DeliveryThroughput {
    delivered: number;

    /** The denominator's other half: `delivered / (delivered + deadLettered)` is the success rate. */
    deadLettered: number;
}
