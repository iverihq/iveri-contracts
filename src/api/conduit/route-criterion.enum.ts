/**
 * One kind of condition a route can set, in the order the gateway evaluates them.
 *
 * The order is the evaluator's, not an arbitrary listing: a route test reports criteria in it, so
 * the first criterion that missed is the one the gateway stopped at.
 */
export enum RouteCriterion {
    ENDPOINT = 'endpoint',
    PROVIDER = 'provider',
    METHOD = 'method',
    PATH = 'path',
    HEADER = 'header',
    BODY = 'body',
}
