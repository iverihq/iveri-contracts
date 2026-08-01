import type { Nullable } from '../../type/nil.type.js';

import type { SignatureAlgorithm } from './signature-algorithm.enum.js';
import type { SignatureEncoding } from './signature-encoding.enum.js';
import type { SignatureVerdict } from './signature-verdict.enum.js';

/** Why a timestamp was or was not inside its replay window. */
export interface TimestampDiagnostic {
    /** Where the timestamp was read from — a header name, or a key inside one. */
    source: string;

    /** Exactly as received. A provider sending milliseconds shows up here. */
    rawValue: string;

    /** Seconds old. Negative means the provider's clock is ahead of ours. */
    ageSeconds: Nullable<number>;

    toleranceSeconds: number;
    withinTolerance: boolean;
}

/**
 * The evidence behind a {@link SignatureVerdict}, not the verdict alone.
 * `GET /api/v1/capture/:id/signature`.
 *
 * **The signing secret never appears here**, in any form — not the value, not a hash, not a
 * length.
 */
export interface SignatureDiagnostic {
    verdict: SignatureVerdict;

    /** One sentence, safe to render directly. */
    summary: string;

    providerKey: Nullable<string>;
    algorithm: Nullable<SignatureAlgorithm>;
    encoding: Nullable<SignatureEncoding>;
    headerName: Nullable<string>;

    /** The header exactly as received, before any prefix was stripped. */
    receivedHeader: Nullable<string>;

    /** The digest read out of that header. */
    receivedSignature: Nullable<string>;

    /** What we computed, in the manifest's encoding. */
    computedSignature: Nullable<string>;

    /**
     * Readable rendering of the exact bytes hashed — truncated and lossy, for recognising the
     * shape. When the bytes themselves matter, use `signedPayloadByteLength` and `bodySha256`.
     */
    signedPayloadPreview: Nullable<string>;

    signedPayloadByteLength: Nullable<number>;

    /** Hex SHA-256 of the body. Compare against what the provider says it sent. */
    bodySha256: string;

    bodyByteLength: number;

    timestamp: Nullable<TimestampDiagnostic>;

    /**
     * Specific, verified observations — each produced by recomputing the digest a different way
     * and finding that it matched. **Every hint is a verified alternative, never a guess**, so
     * acting on one always fixes the problem.
     */
    hints: string[];
}
