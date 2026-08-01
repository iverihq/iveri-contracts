import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

/** One replay attempt and whatever came back. */
export interface Replay {
    id: UUID;
    captureId: UUID;
    targetUrl: string;
    method: string;

    /** The body differed from the capture's, so the original signature no longer verifies. */
    isEdited: boolean;

    /** Null when no response arrived — a timeout, a refused connection. See `errorMessage`. */
    responseStatus: Nullable<number>;

    responseHeaders: Nullable<Record<string, string | string[]>>;

    /** First 64 KB of the response body. */
    responseBodyPreview: Nullable<string>;

    responseBodyTruncated: boolean;

    /**
     * Why it failed. **A failed replay is still a 200 from the replay endpoint** — the target
     * being down is the answer you asked for, not an error on Conduit's side.
     */
    errorMessage: Nullable<string>;

    durationMs: number;
    executedByUserId: Nullable<UUID>;
    createdAt: IsoDateTime;
}

/**
 * Unpaginated: one capture accrues a handful of replays while someone fixes a receiver, not
 * thousands.
 */
export interface ReplaysList {
    items: Replay[];
}

/** `POST /api/v1/capture/:id/replay`. */
export interface ExecuteReplayBody {
    targetUrl: string;

    /** Defaults to the capture's method. */
    method?: Nullable<string>;

    /** Merged over the captured headers. Signature headers are forwarded deliberately. */
    headers?: Nullable<Record<string, string>>;

    /**
     * Replacement body, base64. Omitting it resends the captured bytes exactly, which is the
     * only way the original signature still verifies — editing necessarily invalidates it, and
     * the resulting replay is flagged `isEdited`.
     */
    bodyBase64?: Nullable<string>;
}
