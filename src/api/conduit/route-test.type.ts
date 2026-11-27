import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { MatchOperator } from './match-operator.enum.js';
import type { RouteCriterionMiss } from './route-criterion-miss.enum.js';
import type { RouteCriterion } from './route-criterion.enum.js';
import type { BodyMatcherInput, HeaderMatcherInput } from './route.type.js';

/** How one criterion of a route fared against one capture. */
export interface RouteCriterionResult {
    criterion: RouteCriterion;

    /** The header name or the body path. Null for the other four criteria. */
    field: Nullable<string>;

    /** The header or body matcher's operator. Null for the other four, which compare for equality or by glob. */
    operator: Nullable<MatchOperator>;

    /**
     * What the rule asks for: the endpoint id, provider key, method, path glob, or the matcher's
     * operand. Null for `exists`, which takes none.
     */
    expected: Nullable<string>;

    /**
     * What the capture carried, exactly as the matcher compared it — a repeated header joined
     * with `, `, a body leaf as its JSON spelling. Null when it carried nothing there. Cut to
     * 1000 characters and ended with `…` when longer; the comparison used the whole value.
     */
    actual: Nullable<string>;

    matched: boolean;

    /** Null when the criterion matched. */
    miss: Nullable<RouteCriterionMiss>;
}

/** A route that stops evaluation before another one is reached. */
export interface RouteTestStopper {
    id: UUID;
    name: string;
}

/**
 * `GET /api/v1/routes/:routeId/test?captureId=` and `POST /api/v1/routes/test`.
 *
 * Evaluated by the same matcher the gateway runs on every inbound request, against the stored
 * capture as it arrived. Nothing is sent and nothing is written.
 */
export interface RouteTestResult {
    captureId: UUID;

    /** Every criterion matched. A route that sets no criterion matches every request. */
    matched: boolean;

    /**
     * Only the criteria the route sets, in the order the gateway evaluates them. Unlike the
     * gateway, which stops at the first miss, every criterion is evaluated, so an operator sees
     * all of what is wrong at once.
     */
    criteria: RouteCriterionResult[];

    /**
     * An earlier active route with `stopOnMatch` that also matches this capture, so the gateway
     * stops before it reaches this one: the route matches and would still not fire. Null when
     * nothing stands in the way. Reported whether or not this route matched.
     */
    stoppedBy: Nullable<RouteTestStopper>;

    /**
     * The endpoint's provider key the provider criterion was compared with. A capture does not
     * record it, so this is the endpoint's **current** key; null when the endpoint has none or is
     * gone.
     */
    providerKey: Nullable<string>;
}

/**
 * `POST /api/v1/routes/test`: criteria not saved yet, as a route form holds them.
 *
 * The criteria take the same values and the same "absent means any" meaning as
 * `CreateRouteBody`, and are normalised the same way before they are evaluated.
 */
export interface TestRouteBody {
    captureId: UUID;

    /**
     * The route being edited, if any: it is not reported as stopping itself, and its age decides
     * its place among routes of the same priority. Omitted for a route not created yet, which
     * would be evaluated after every existing route of its priority.
     */
    routeId?: Nullable<UUID>;

    endpointId?: Nullable<UUID>;
    providerKey?: Nullable<string>;
    method?: Nullable<string>;
    pathPattern?: Nullable<string>;
    headerMatchers?: Nullable<HeaderMatcherInput[]>;
    bodyMatchers?: Nullable<BodyMatcherInput[]>;

    /** Decides which routes are evaluated before it. Default 100, as on create. */
    priority?: Nullable<number>;
}
