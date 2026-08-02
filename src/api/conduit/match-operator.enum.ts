/**
 * How one header or body matcher compares.
 *
 * Four operators, and the list is short on purpose. A routing rule is declarative data, never
 * code, and every operator added here is a step toward an expression language — the moment a
 * rule can express arbitrary logic we own the customer's bugs and can never change the
 * evaluator.
 *
 * `EXISTS` earns its place because "this field is present at all" is the most common real
 * condition and cannot be written with the other three.
 */
export enum MatchOperator {
    /** Exact string comparison, case-sensitive. */
    EQUALS = 'equals',

    /** Substring. Deliberately not a regular expression. */
    CONTAINS = 'contains',

    /** Value starts with the operand. Enough for `application/json; charset=utf-8`. */
    STARTS_WITH = 'starts-with',

    /** The field is present, whatever its value. The operand is ignored. */
    EXISTS = 'exists',
}
