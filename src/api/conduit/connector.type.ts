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
 * Credential names a JWT bearer manifest expects to find on a connection.
 *
 * They are the three fields of a Google service account's key file (`client_email`, `private_key`,
 * `private_key_id`) under this API's camelCase. A client reading an uploaded key file maps those
 * fields to these names; the rest of the file — the project id, the token URI — is either public or
 * already the manifest's, so it is not kept. `privateKeyId` is optional: it only selects which of a
 * service account's keys the provider checks the signature against.
 */
export const CONNECTOR_CREDENTIAL_CLIENT_EMAIL = 'clientEmail';
export const CONNECTOR_CREDENTIAL_PRIVATE_KEY = 'privateKey';
export const CONNECTOR_CREDENTIAL_PRIVATE_KEY_ID = 'privateKeyId';

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

    /**
     * The provider's consent page. `OAUTH2_AUTHORIZATION_CODE` only.
     *
     * Not an outbound target — a person's browser goes there, never Conduit — but it must be https
     * (or a private address where those are allowed), because the consent page is where somebody
     * types their password.
     */
    authorizationUrl: Nullable<string>;

    /**
     * Extra query parameters on the consent URL for a **company's** connection. `OAUTH2_AUTHORIZATION_CODE` only.
     *
     * `scope` is sent as well when set. Data, because providers name things differently — Google
     * wants `access_type=offline` before it issues a refresh token, Slack takes bot scopes as
     * `scope` and a person's scopes as `user_scope`. The parameters the flow itself depends on
     * (`response_type`, `client_id`, `redirect_uri`, `state`, `code_challenge`,
     * `code_challenge_method`) are always Conduit's and cannot be overridden here.
     */
    authorizationParams: Nullable<Record<string, string>>;

    /**
     * The consent URL's parameters for a **person's own** connection, used *instead of* `scope`
     * and {@link authorizationParams}. `OAUTH2_AUTHORIZATION_CODE` only. Null means the same as a
     * company's.
     *
     * Separate because a person asks for less than a company admin does, and asking for more fails:
     * Slack reinstalls the bot when a consent page requests bot scopes, which an ordinary member is
     * usually not allowed to do. A person connecting their own Slack asks for `user_scope` alone.
     */
    personAuthorizationParams: Nullable<Record<string, string>>;

    /**
     * Where the token fields sit in the token response, tried in order. `OAUTH2_AUTHORIZATION_CODE` only.
     *
     * Each entry is a dotted path to an object holding RFC 6749's `access_token`, `refresh_token` and
     * `expires_in`; an empty string is the response itself. The first object carrying an
     * `access_token` wins, and its refresh token and lifetime are read from that same object, so a
     * bot token is never paired with a user's refresh token. Null means the response itself only,
     * which is what RFC 6749 describes. Slack's install answers with a bot token at the top and a
     * person's token under `authed_user`: `['', 'authed_user']`.
     */
    tokenObjectPaths: Nullable<string[]>;

    /**
     * Which variable names the user a service account acts as. `OAUTH2_JWT_BEARER` only.
     *
     * Read from the connection's variables first and the dispatch's `pathParams` second — the same
     * order as a path placeholder, so a connection that fixes it cannot be made to act as anybody
     * else. Absent from both, the service account acts as itself, which is how it reaches a
     * calendar shared with it directly. Null means it always acts as itself.
     */
    subjectVariable: Nullable<string>;
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
    authorizationUrl?: Nullable<string>;
    authorizationParams?: Nullable<Record<string, string>>;
    personAuthorizationParams?: Nullable<Record<string, string>>;
    tokenObjectPaths?: Nullable<string[]>;
    subjectVariable?: Nullable<string>;
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

    /**
     * Statuses meaning the change is **already in place**, recorded as a success.
     *
     * An insert whose id already exists answers 409, a delete of something already gone answers
     * 404 or 410 — and that is exactly what a retry after a lost response sees. A caller that
     * supplies its own id, as a calendar event's is made from a leave request's, is idempotent at
     * the provider; without this the retry that proves it dead-letters, and a dead-letter queue
     * full of things that worked teaches an operator to stop reading it. Empty for most operations.
     */
    alreadyAppliedStatuses: number[];
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

    /**
     * A dotted path to a boolean the provider sets `true` in a successful JSON response, or null.
     *
     * For a provider that answers **200 to a failure**: Slack's Web API returns
     * `{ "ok": false, "error": "channel_not_found" }` with a 200, so by status alone every refused
     * message reads as delivered. With `ok` here, a 2xx whose body does not hold `true` at that path
     * is a permanent failure, kept with its body for the operator. A body that is not JSON fails
     * the same way: the provider promised a flag and did not send one.
     */
    successBodyField: Nullable<string>;
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
