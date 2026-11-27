/**
 * Why one criterion of a route did not match a request.
 *
 * A closed set, so a client can say it in the reader's language and an operator can tell the five
 * remedies apart. Three of them say the body could not be read at all, and they are separate
 * because the fixes are: an empty body needs a different route, an oversized one is a limit, and
 * a form-encoded one needs a path or header criterion instead, since a body matcher cannot read
 * inside a form.
 *
 * Every one of them means **not matched**. A criterion that cannot be evaluated does not match:
 * a gateway that forwards on "I could not tell" sends a customer's data somewhere they did not ask
 * for.
 */
export enum RouteCriterionMiss {
    /** The request carried a value, and it is not the one the rule asks for. */
    DIFFERENT_VALUE = 'different-value',

    /**
     * The header, or the body field, is not on the request. A body path that resolves to an
     * object, an array or `null` counts as absent too: a matcher compares strings.
     */
    FIELD_ABSENT = 'field-absent',

    /** The operator compares against a value and the rule gives none. */
    NO_OPERAND = 'no-operand',

    /** A body matcher, and the request had no body. */
    BODY_EMPTY = 'body-empty',

    /** A body matcher, and the body is over the 1 MB the gateway parses for routing. */
    BODY_TOO_LARGE = 'body-too-large',

    /** A body matcher, and the body is not JSON — form-encoded, XML, or malformed. */
    BODY_NOT_JSON = 'body-not-json',
}
