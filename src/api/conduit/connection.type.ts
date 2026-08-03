import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

/**
 * One tenant's configured instance of a connector: the credentials and the account details that
 * turn a manifest into something that can actually send.
 *
 * The split is the reason a manifest can ship in the binary. A connector says "WhatsApp Cloud
 * lives at graph.facebook.com and authenticates with a bearer token"; a connection says "and
 * *this* is our token, for *this* phone number". One is ours and identical for everybody; the
 * other is the customer's and is the single most sensitive thing this service holds.
 *
 * **No endpoint of this API returns a credential value**, in any form — not masked, not
 * truncated, not a length. `credentialNames` answers the only question an operator has, which is
 * whether something is configured. Same control as a destination's headers and an endpoint's
 * signing secret, for the same reason: §11 says one leak ends the company.
 */
export interface Connection {
    id: UUID;

    /** Stable identifier a dispatch names instead of an id, so callers can be configured by name. */
    key: string;

    name: string;
    description: Nullable<string>;

    /** The manifest this connection instantiates. Built-in or tenant-defined. */
    connectorKey: string;

    /** Sorted. **The values are never returned by any endpoint of this API.** */
    credentialNames: string[];

    /**
     * Non-secret values filling `{placeholders}` in an operation path — a phone number id, an
     * account id, an API version.
     *
     * Deliberately separate from credentials rather than one map with a secrecy flag: a flag is
     * a thing somebody sets wrong once, and the failure mode is a token in a response body.
     * Variables are returned in full because they are the part an operator needs to check.
     */
    variables: Record<string, string>;

    /**
     * When the cached OAuth access token stops being usable, or null when there is none —
     * either because the connector authenticates statically or because nothing has fetched one
     * yet.
     *
     * The expiry is returned, the token is not. It is what makes "why is this connection
     * failing" answerable without exposing anything.
     */
    accessTokenExpiresAt: Nullable<IsoDateTime>;

    /**
     * Why the last authentication attempt failed, or null when the last one worked.
     *
     * A refresh token that a provider has revoked is the most common real failure on this
     * aggregate, and it is invisible otherwise: dispatches simply dead-letter with a 401 and
     * nothing points at the connection.
     */
    lastAuthError: Nullable<string>;

    /** Stops *new* dispatches being accepted. Does not cancel ones already queued. */
    isActive: boolean;

    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/** `GET /api/v1/connections`. Offset-paginated — a small, slow-moving collection. */
export interface ConnectionsPage {
    items: Connection[];
    total: number;
    limit: number;
    offset: number;
}

/** `POST /api/v1/connections`. */
export interface CreateConnectionBody {
    key: string;
    name: string;
    description?: Nullable<string>;
    connectorKey: string;

    /**
     * Secrets this connection authenticates with. **Stored encrypted and never returned.**
     *
     * Which names are expected depends on the connector's auth type: an `API_KEY_HEADER`
     * manifest names its own, an OAuth one wants `clientId`/`clientSecret` and, for the refresh
     * grant, `refreshToken`.
     */
    credentials: Record<string, string>;

    variables?: Nullable<Record<string, string>>;
}

/**
 * `PATCH /api/v1/connections/:id`.
 *
 * **`credentials` has three states, not two.** Omitting it leaves the stored map untouched,
 * `null` clears it, an object replaces it wholesale. A form that sends `{}` meaning "unchanged"
 * deletes the customer's token, and the symptom is every dispatch dead-lettering on a 401.
 *
 * Replacing credentials also discards the cached access token: a token minted from the old
 * client secret is not evidence that the new one works, and keeping it would hide a typo until
 * the token happened to expire.
 */
export interface UpdateConnectionBody {
    name?: string;
    description?: Nullable<string>;
    credentials?: Nullable<Record<string, string>>;
    variables?: Nullable<Record<string, string>>;
    isActive?: boolean;
}
