import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { Paginated } from '../../type/paginated.type.js';
import type { UUID } from '../../type/uuid.type.js';

/**
 * One endpoint on the wire.
 *
 * Carries `hasSigningSecret`, never the secret. Not a masked value, not a last-four hint — the
 * field simply does not exist, so no future change can accidentally start populating it.
 */
export interface Endpoint {
    id: UUID;
    name: string;
    description: Nullable<string>;

    /** The path segment providers post to. */
    ingressToken: string;

    /**
     * Path to register with the provider. Relative on purpose — the public origin is a tunnel or
     * a load balancer this service cannot see, so the caller prepends its own.
     */
    ingressPath: string;

    providerKey: Nullable<string>;

    /** Whether a signing secret is configured. The secret itself is never returned. */
    hasSigningSecret: boolean;

    /** Whether a handshake verify token is configured. */
    hasVerifyToken: boolean;

    /** Inactive endpoints answer 410 Gone. */
    isActive: boolean;

    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/**
 * `GET /api/v1/endpoint`. Offset-paginated, unlike captures: endpoints are a small, slow-moving
 * collection a customer renders as numbered pages.
 */
export type EndpointsPage = Paginated<Endpoint>;

/** `POST /api/v1/endpoint`. */
export interface CreateEndpointBody {
    name: string;
    description?: Nullable<string>;
    providerKey?: Nullable<string>;
    signingSecret?: Nullable<string>;
    verifyToken?: Nullable<string>;
}

/**
 * `PATCH /api/v1/endpoint/:id`.
 *
 * **Secret fields have three states, not two.** Omitting one leaves the stored secret untouched;
 * sending `null` deletes it. A form must therefore never send `''` or `null` where the user
 * meant "I did not change this" — that silently wipes a working signing secret, and the next
 * webhook verifies as `MISSING_SECRET` with nothing to say why.
 */
export interface UpdateEndpointBody {
    name?: string;
    description?: Nullable<string>;
    providerKey?: Nullable<string>;
    signingSecret?: Nullable<string>;
    verifyToken?: Nullable<string>;
    isActive?: boolean;
}

/** Query for `GET /api/v1/endpoint`. */
export interface GetEndpointsQuery {
    limit?: number;
    offset?: number;
}
