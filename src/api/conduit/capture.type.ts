import type { CursorPage } from '../../type/cursor-page.type.js';
import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { SignatureVerdict } from './signature-verdict.enum.js';

/** A capture without its body — one row of the list. */
export interface CaptureSummary {
    id: UUID;
    endpointId: UUID;

    method: string;

    /** Path after the ingress token. */
    path: string;

    /** Raw query string, without the `?`. */
    queryString: string;

    contentType: Nullable<string>;

    /** Body size in bytes, as received. */
    bodySize: number;

    /** Hex SHA-256 of the body. Compare this against what the provider says it sent. */
    bodySha256: string;

    /** From `x-forwarded-for`. Advisory — a client controls it. */
    sourceIp: Nullable<string>;

    /**
     * Verdict recorded **when the request arrived**. A snapshot: fixing the endpoint's secret
     * does not rewrite it. Re-run the signature route to check against current configuration.
     */
    signatureVerdict: Nullable<SignatureVerdict>;

    /** A provider's URL-verification challenge rather than a real event. */
    isHandshake: boolean;

    receivedAt: IsoDateTime;
}

/** A capture with its headers and body. `GET /api/v1/capture/:id`. */
export interface CaptureDetail extends CaptureSummary {
    /** Every request header, lowercase keys — including the signature headers. */
    headers: Record<string, string | string[]>;

    /**
     * The body as UTF-8 when it decodes cleanly, otherwise `null`.
     *
     * A convenience only. `toString('utf8')` never fails — it substitutes U+FFFD for every
     * invalid sequence — so a gzip or protobuf body would come back as convincing-looking
     * mojibake that no longer hashes to `bodySha256`. Conduit round-trips the decode and sends
     * `null` when it does not survive, which is the honest answer.
     */
    body: Nullable<string>;

    /**
     * The body as base64. **This is the authoritative field.** A webhook body is arbitrary
     * bytes; base64 is the only representation that survives JSON without alteration, and the
     * signed payload is those exact bytes.
     */
    bodyBase64: string;

    /** The body was too large to inline and was read back from a spill file. */
    isSpilled: boolean;
}

/** `GET /api/v1/capture`. */
export type CapturesPage = CursorPage<CaptureSummary>;

/**
 * Query for `GET /api/v1/capture`.
 *
 * Cursor-paginated, unlike endpoints and providers: captures are appended to while they are
 * being read — every inbound webhook lands at the top of the list, including while an operator
 * pages through it — and offset paging drops or repeats rows under that.
 */
export interface GetCapturesQuery {
    limit?: number;

    /** Opaque cursor from the previous page's `nextCursor`. Never parse it. */
    after?: Nullable<string>;

    endpointId?: Nullable<UUID>;
    method?: Nullable<string>;
    signatureVerdict?: Nullable<SignatureVerdict>;
}
