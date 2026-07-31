/**
 * Represents a value that is either `null` or `undefined`.
 *
 * Useful for excluding nullish values from union types via `Exclude<T, Nil>`
 * or for explicitly modelling absent values.
 */
export type Nil = null | undefined;

/**
 * A value that may be `T` or absent (`null` / `undefined`).
 *
 * Prefer `Maybe<T>` over inline `T | null | undefined` for consistency
 * across services.
 */
export type Maybe<T> = T | Nil;

/**
 * A value that may be `T` or `null` (but never `undefined`).
 *
 * Use this for anything that crosses the wire: `JSON.stringify` drops
 * `undefined` properties, so a nullable API field must be `null` to survive
 * serialization.
 */
export type Nullable<T> = T | null;
