import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ConnectorAuthType } from './connector-auth-type.enum.js';

/**
 * Credential names an OAuth manifest expects to find on a connection.
 *
 * Fixed rather than manifest-configurable: these are the field names RFC 6749 gives the token
 * request, so letting a manifest rename them would only allow it to be wrong.
 */
export const CONNECTOR_CREDENTIAL_CLIENT_ID = 'clientId';
export const CONNECTOR_CREDENTIAL_CLIENT_SECRET = 'clientSecret';
export const CONNECTOR_CREDENTIAL_REFRESH_TOKEN = 'refreshToken';

/**
 * How a connector authenticates, as data.
 *
 * Flat with a discriminating {@link ConnectorAuthType} and nullable fields, matching
 * `SignatureManifest` — a discriminated union reads better in TypeScript and validates far worse
 * as a request body, and this shape has to survive `class-validator` on the way in.
 *
 * **A manifest holds no secret.** It names *where* the credential goes; the credential itself
 * lives on a connection, encrypted. That is what makes a manifest safe to return in full to
 * anyone with `conduit:connector:read` and safe to ship in the binary.
 */
export interface ConnectorAuthManifest {
    type: ConnectorAuthType;

    /**
     * Which credential on the connection holds the secret. `API_KEY_HEADER` only.
     *
     * OAuth manifests do not set it — they read the fixed names above, because those are defined
     * by the grant rather than by us.
     */
    credentialKey: Nullable<string>;

    /** Lowercase header the credential is sent in. `API_KEY_HEADER` only. */
    headerName: Nullable<string>;

    /** Literal text before the credential, e.g. `Bearer ` or `Basic `. Kept verbatim, spaces included. */
    valuePrefix: Nullable<string>;

    /** Token endpoint. `OAUTH2_*` only. Vetted against the SSRF blocklist like any other target. */
    tokenUrl: Nullable<string>;

    /** `scope` sent with the token request, when the provider wants one. */
    scope: Nullable<string>;

    /**
     * Seconds shaved off a token's reported lifetime before it counts as expired.
     *
     * Not a nicety. A token that expires while a request is in flight fails with a 401 that looks
     * exactly like a revoked credential, and the retry that would fix it is indistinguishable
     * from one that never will. Refreshing slightly early makes that case rare instead of
     * routine. Null falls back to the service default.
     */
    expirySkewSeconds: Nullable<number>;
}

/** {@link ConnectorAuthManifest} as sent on create/update: nullable fields may simply be omitted. */
export interface ConnectorAuthManifestInput {
    type: ConnectorAuthType;
    credentialKey?: Nullable<string>;
    headerName?: Nullable<string>;
    valuePrefix?: Nullable<string>;
    tokenUrl?: Nullable<string>;
    scope?: Nullable<string>;
    expirySkewSeconds?: Nullable<number>;
}

/**
 * One thing a connector can be asked to do.
 *
 * A dispatch names an operation by {@link key} rather than supplying a URL, and that is the
 * whole security model of the outbound side: a caller chooses from a list somebody with
 * `conduit:connector:manage` wrote down, instead of naming a host Conduit will then post to.
 * Outbound would otherwise be an open proxy with authentication attached.
 */
export interface ConnectorOperation {
    /** Stable identifier a dispatch names. Lowercase kebab-case: `send-message`. */
    key: string;

    /** Human-readable label for the admin UI. */
    name: string;

    method: string;

    /**
     * Path appended to the connector's `baseUrl`.
     *
     * `{name}` placeholders are filled from the connection's variables first and the dispatch's
     * `pathParams` second. Every placeholder must resolve, or the dispatch is refused at submit
     * time rather than dead-lettering later — the caller is still on the phone at submit time.
     */
    path: string;

    description: Nullable<string>;
}

/** Requests per minute, and how many may arrive at once. Applied per connection. */
export interface ConnectorRateLimit {
    perMinute: number;
    burst: number;
}

/**
 * When to try again, and when to stop.
 *
 * Per connector rather than global because providers genuinely differ: one returns 429 with a
 * generous window, another treats a burst as abuse and blocks for an hour.
 */
export interface ConnectorRetryPolicy {
    maxAttempts: number;
    backoffBaseMs: number;
    backoffMaxMs: number;

    /**
     * Statuses to retry **in addition** to the transient default set (5xx, 408, 425, 429).
     *
     * Additive, never subtractive: a manifest can say "this provider's 400 is transient", which
     * is a fact about that provider, but it cannot claim a 502 is permanent — nothing about a
     * gateway error is provider-specific and the ability to get it wrong buys nothing.
     */
    retryableStatuses: number[];

    /**
     * Statuses meaning the access token is stale.
     *
     * Handled once per attempt and unlike any other status: the token is discarded, refreshed,
     * and the request is sent again immediately rather than after a backoff. A token that
     * expired thirty seconds early is not a failing destination and should not be treated as one.
     */
    authFailureStatuses: number[];
}

/**
 * A third-party API, described entirely as data. §11's "connector manifest".
 *
 * Conduit contains no `if (connector === 'whatsapp')` anywhere. Adding TikTok is a manifest and
 * a credential; the code that sends the request never learns a provider's name.
 */
export interface Connector {
    /** Null for a built-in — it is not a row and cannot be edited or deleted. */
    id: Nullable<UUID>;

    /** Stable identifier a connection references. Lowercase kebab-case. */
    key: string;

    name: string;
    description: Nullable<string>;

    /** Absolute https base every operation path is appended to. */
    baseUrl: string;

    auth: ConnectorAuthManifest;

    operations: ConnectorOperation[];

    /** Null means only the service-wide default applies. */
    rateLimit: Nullable<ConnectorRateLimit>;

    retry: ConnectorRetryPolicy;

    /**
     * Ships with Conduit, in code rather than as a seeded row. Override it by defining your own
     * under the same key — resolution checks a tenant's rows first.
     */
    isBuiltIn: boolean;

    /** Null for a built-in. */
    createdAt: Nullable<IsoDateTime>;

    /** Null for a built-in. */
    updatedAt: Nullable<IsoDateTime>;
}

/** Built-ins plus whatever one customer has defined. `GET /api/v1/connectors`. */
export interface ConnectorsList {
    items: Connector[];
}

/** `POST /api/v1/connectors`. */
export interface CreateConnectorBody {
    key: string;
    name: string;
    description?: Nullable<string>;
    baseUrl: string;
    auth: ConnectorAuthManifestInput;
    operations: ConnectorOperation[];
    rateLimit?: Nullable<ConnectorRateLimit>;
    retry?: Nullable<ConnectorRetryPolicy>;
}

/**
 * `PATCH /api/v1/connectors/:id`.
 *
 * `operations` replaces the list wholesale — there is no per-operation patch. Merging would make
 * "remove an operation" unexpressible, and an operation nobody can remove is a URL Conduit will
 * post to forever.
 */
export interface UpdateConnectorBody {
    name?: string;
    description?: Nullable<string>;
    baseUrl?: string;
    auth?: ConnectorAuthManifestInput;
    operations?: ConnectorOperation[];
    rateLimit?: Nullable<ConnectorRateLimit>;
    retry?: Nullable<ConnectorRetryPolicy>;
}
