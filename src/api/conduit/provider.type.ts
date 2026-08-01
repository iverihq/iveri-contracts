import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HandshakeKind } from './handshake-kind.enum.js';
import type { SignatureAlgorithm } from './signature-algorithm.enum.js';
import type { SignatureEncoding } from './signature-encoding.enum.js';
import type { SignatureHeaderScheme } from './signature-header-scheme.enum.js';

/** Required in `signedPayloadTemplate`; substituted with the raw request bytes. */
export const SIGNED_PAYLOAD_BODY_TOKEN = '{body}';

/** Optional in `signedPayloadTemplate`; substituted with the timestamp exactly as received. */
export const SIGNED_PAYLOAD_TIMESTAMP_TOKEN = '{timestamp}';

/**
 * How to verify one provider's HMAC.
 *
 * A manifest holds **no secret**. It describes where a signature lives and how it is computed,
 * never the key it is computed with — which is why it is returned in full to anyone with
 * `conduit:provider:read` while the signing secret it is used against is returned to nobody.
 *
 * This is the response shape: every key is present, absent ones are `null`. The request shape
 * is {@link SignatureManifestInput}, where they may be omitted.
 */
export interface SignatureManifest {
    algorithm: SignatureAlgorithm;
    encoding: SignatureEncoding;

    /** Lowercase header the signature arrives in, e.g. `x-hub-signature-256`. */
    headerName: string;

    headerScheme: SignatureHeaderScheme;

    /** Literal prefix stripped before comparison, e.g. `sha256=`. `DIRECT` scheme only. */
    headerPrefix: Nullable<string>;

    /** Key naming the signature inside a `KEY_VALUE_LIST` header, e.g. `v1`. */
    signatureKey: Nullable<string>;

    /** Separate header carrying the signed timestamp, when it is not in the signature header. */
    timestampHeaderName: Nullable<string>;

    /** Key naming the timestamp inside a `KEY_VALUE_LIST` header, e.g. `t`. */
    timestampKey: Nullable<string>;

    /** Replay window. Null disables the age check entirely. */
    timestampToleranceSeconds: Nullable<number>;

    /**
     * What gets hashed. {@link SIGNED_PAYLOAD_BODY_TOKEN} is required;
     * {@link SIGNED_PAYLOAD_TIMESTAMP_TOKEN} is optional — Slack's is `v0:{timestamp}:{body}`,
     * Meta's is just `{body}`.
     */
    signedPayloadTemplate: string;
}

/** {@link SignatureManifest} as sent on create/update: nullable fields may simply be omitted. */
export interface SignatureManifestInput {
    algorithm: SignatureAlgorithm;
    encoding: SignatureEncoding;
    headerName: string;
    headerScheme: SignatureHeaderScheme;
    headerPrefix?: Nullable<string>;
    signatureKey?: Nullable<string>;
    timestampHeaderName?: Nullable<string>;
    timestampKey?: Nullable<string>;
    timestampToleranceSeconds?: Nullable<number>;
    signedPayloadTemplate: string;
}

/**
 * How to answer one provider's URL-verification challenge.
 *
 * The fields split by {@link HandshakeKind} — a `QUERY_ECHO` manifest populates the four query
 * parameter names and nulls the rest, a `JSON_ECHO` manifest does the opposite.
 */
export interface HandshakeManifest {
    kind: HandshakeKind;

    // ── QUERY_ECHO (Meta) ───────────────────────────────────────────────────

    /** Query parameter holding the value to echo back, e.g. `hub.challenge`. */
    challengeParam: Nullable<string>;

    /** Query parameter holding the token to compare against the endpoint's, e.g. `hub.verify_token`. */
    verifyTokenParam: Nullable<string>;

    /** Query parameter naming the operation, e.g. `hub.mode`. */
    modeParam: Nullable<string>;

    /** Value `modeParam` must hold for this to be a handshake, e.g. `subscribe`. */
    expectedMode: Nullable<string>;

    // ── JSON_ECHO (Slack) ───────────────────────────────────────────────────

    /** Top-level body field identifying a handshake, e.g. `type`. */
    triggerField: Nullable<string>;

    /** Value `triggerField` must hold, e.g. `url_verification`. */
    triggerValue: Nullable<string>;

    /** Body field holding the value to echo back, e.g. `challenge`. */
    challengeField: Nullable<string>;
}

/** {@link HandshakeManifest} as sent on create/update: nullable fields may simply be omitted. */
export interface HandshakeManifestInput {
    kind: HandshakeKind;
    challengeParam?: Nullable<string>;
    verifyTokenParam?: Nullable<string>;
    modeParam?: Nullable<string>;
    expectedMode?: Nullable<string>;
    triggerField?: Nullable<string>;
    triggerValue?: Nullable<string>;
    challengeField?: Nullable<string>;
}

/** One provider on the wire. `GET /api/v1/provider`. */
export interface Provider {
    /** Null for a built-in — it is not a row and cannot be edited or deleted. */
    id: Nullable<UUID>;

    key: string;
    name: string;
    description: Nullable<string>;

    /** Null when this provider signs nothing. */
    signature: Nullable<SignatureManifest>;

    /** Null when this provider has no URL challenge. */
    handshake: Nullable<HandshakeManifest>;

    /**
     * Ships with Conduit, in code rather than as a seeded row. Override it by creating your own
     * under the same key — resolution checks a tenant's rows first.
     */
    isBuiltIn: boolean;

    /** Null for a built-in. */
    createdAt: Nullable<IsoDateTime>;

    /** Null for a built-in. */
    updatedAt: Nullable<IsoDateTime>;
}

/**
 * Not paginated: the list is the built-ins plus whatever one customer has defined by hand.
 * Wrapped in an object rather than returned as a bare array so a `total` or a cursor can be
 * added later without breaking every client.
 */
export interface ProvidersList {
    items: Provider[];
}

/** `POST /api/v1/provider`. */
export interface CreateProviderBody {
    key: string;
    name: string;
    description?: Nullable<string>;
    signature?: Nullable<SignatureManifestInput>;
    handshake?: Nullable<HandshakeManifestInput>;
}

/** `PATCH /api/v1/provider/:id`. */
export interface UpdateProviderBody {
    name?: string;
    description?: Nullable<string>;

    /** Send `null` to stop verifying this provider's signatures. */
    signature?: Nullable<SignatureManifestInput>;

    /** Send `null` to stop answering this provider's challenge. */
    handshake?: Nullable<HandshakeManifestInput>;
}
