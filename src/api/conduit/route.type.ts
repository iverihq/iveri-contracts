import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Maybe, Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { MatchOperator } from './match-operator.enum.js';

/** One condition on a request header. */
export interface HeaderMatcher {
    /** Lowercase. Inbound header names are lowercased, so anything else never matches. */
    name: string;
    operator: MatchOperator;
    /** Ignored when the operator is `exists`. */
    value: Nullable<string>;
}

/**
 * One condition on a field inside a JSON body.
 *
 * `path` is a **dotted path**, not JSONPath: `type`, `data.object.id`, `entry.0.changes.0.field`.
 * Numeric segments index arrays.
 *
 * Deliberately not JSONPath and not a regular expression. An expression evaluator running over
 * an attacker-controlled webhook body is a different risk class from a path walk —
 * `jsonpath-plus` shipped a remote code execution hole doing exactly this job (CVE-2024-21534).
 * A dotted path has nothing in it to exploit, and it covers every real routing rule: branch on
 * an event type, a channel, an object id.
 */
export interface BodyMatcher {
    path: string;
    operator: MatchOperator;
    /** Ignored when the operator is `exists`. */
    value: Nullable<string>;
}

/** A matcher as sent on a request, where the operand may simply be omitted. */
export interface HeaderMatcherInput extends Omit<HeaderMatcher, 'value'> {
    value?: Maybe<string>;
}

/** A body matcher as sent on a request. See {@link HeaderMatcherInput}. */
export interface BodyMatcherInput extends Omit<BodyMatcher, 'value'> {
    value?: Maybe<string>;
}

/**
 * Which captures fan out to which destinations.
 *
 * **Every criterion is nullable, and null means "any".** A route with all of them null matches
 * every request on the tenant, which is what a customer writes first. Criteria are ANDed; there
 * is no OR and no negation, because two routes express an OR and one rule that can express
 * arbitrary boolean logic is a language.
 */
export interface Route {
    id: UUID;
    name: string;
    description: Nullable<string>;

    /** Null matches any endpoint. */
    endpointId: Nullable<UUID>;

    /** Null matches any provider. */
    providerKey: Nullable<string>;

    /** Null matches any method. */
    method: Nullable<string>;

    /**
     * Glob over the path after the ingress token. `*` spans one segment, `**` spans any number,
     * and both ends are anchored — `/orders` does not match `/orders/created`. A glob rather
     * than a regular expression: a customer-supplied pattern evaluated on the ingress path would
     * be a ReDoS primitive. Null matches any path.
     */
    pathPattern: Nullable<string>;

    /** Empty rather than null when there are no conditions, so a client handles one spelling. */
    headerMatchers: HeaderMatcher[];
    bodyMatchers: BodyMatcher[];

    /** In order. At least one. */
    destinationIds: UUID[];

    /** Evaluation order, lowest first. Only observable through `stopOnMatch`. */
    priority: number;

    /**
     * Stop evaluating further routes once this one matches.
     *
     * Default false, so the natural behaviour is fan-out — two routes matching one request both
     * fire, which is what "also send this to the audit service" means.
     */
    stopOnMatch: boolean;

    isActive: boolean;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/** `GET /api/v1/routes`. Ordered by priority then age — the order they are evaluated in. */
export interface RoutesPage {
    items: Route[];
    total: number;
    limit: number;
    offset: number;
}

/** `POST /api/v1/routes`. */
export interface CreateRouteBody {
    name: string;
    description?: Nullable<string>;
    endpointId?: Nullable<UUID>;
    providerKey?: Nullable<string>;
    method?: Nullable<string>;
    pathPattern?: Nullable<string>;
    headerMatchers?: Nullable<HeaderMatcherInput[]>;
    bodyMatchers?: Nullable<BodyMatcherInput[]>;
    destinationIds: UUID[];
    priority?: Nullable<number>;
    stopOnMatch?: Nullable<boolean>;
}

/**
 * `PATCH /api/v1/routes/:id`.
 *
 * For the criteria, `null` and omission differ: omitting leaves the stored criterion alone,
 * sending `null` widens the route to "any" for it. A form must send `null` rather than `''` to
 * clear one — an empty string is a criterion nothing matches, which looks like the route broke.
 */
export interface UpdateRouteBody {
    name?: string;
    description?: Nullable<string>;
    endpointId?: Nullable<UUID>;
    providerKey?: Nullable<string>;
    method?: Nullable<string>;
    pathPattern?: Nullable<string>;
    headerMatchers?: Nullable<HeaderMatcherInput[]>;
    bodyMatchers?: Nullable<BodyMatcherInput[]>;
    destinationIds?: UUID[];
    priority?: number;
    stopOnMatch?: boolean;
    isActive?: boolean;
}
