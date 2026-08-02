import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

/**
 * A URL Conduit delivers to, in gateway mode.
 *
 * Carries `headerNames`, never the header values. Not masked, not truncated — the values have no
 * field to appear in, the same control the endpoint shapes use for signing secrets. An operator
 * can see that `authorization` is configured; nobody can read it back.
 */
export interface Destination {
    id: UUID;
    name: string;
    description: Nullable<string>;
    url: string;

    /** Null means the provider's own method is reused — a gateway is a proxy, and a PUT meant a PUT. */
    method: Nullable<string>;

    /** Sorted, lowercase. **The values are never returned by any endpoint of this API.** */
    headerNames: string[];

    /** Per-attempt timeout. Null falls back to the service default. */
    timeoutMs: Nullable<number>;

    /** Attempts before dead-lettering. Null falls back to the service default. */
    maxAttempts: Nullable<number>;

    /** Stops *new* deliveries being enqueued. Does not cancel ones already queued. */
    isActive: boolean;

    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/** `GET /api/v1/destinations`. Offset-paginated — a small, slow-moving collection. */
export interface DestinationsPage {
    items: Destination[];
    total: number;
    limit: number;
    offset: number;
}

/** `POST /api/v1/destinations`. */
export interface CreateDestinationBody {
    name: string;
    description?: Nullable<string>;

    /**
     * Absolute http/https URL. Private, loopback and link-local addresses are refused unless the
     * service is configured to allow them, which it is locally and is not anywhere else.
     * Credentials in the URL are rejected outright — send them as a header.
     */
    url: string;

    method?: Nullable<string>;

    /**
     * Static headers merged over the forwarded ones. **Stored encrypted and never returned.**
     * This is where an `Authorization` header for the receiver goes.
     */
    headers?: Nullable<Record<string, string>>;

    timeoutMs?: Nullable<number>;
    maxAttempts?: Nullable<number>;
}

/**
 * `PATCH /api/v1/destinations/:id`.
 *
 * **`headers` has three states, not two.** Omitting it leaves the stored map untouched, `null`
 * clears it, an object replaces it wholesale. A form must never send `{}` where it means
 * "unchanged" — that strips the receiver's auth header, and the symptom is 401s on deliveries
 * that worked yesterday.
 */
export interface UpdateDestinationBody {
    name?: string;
    description?: Nullable<string>;
    url?: string;
    method?: Nullable<string>;
    headers?: Nullable<Record<string, string>>;
    timeoutMs?: Nullable<number>;
    maxAttempts?: Nullable<number>;
    isActive?: boolean;
}
