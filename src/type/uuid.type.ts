/**
 * A UUID string value.
 *
 * Structurally identical to the `UUID` type from `node:crypto`, but declared
 * here rather than re-exported: `@iveri/contracts` compiles into browser
 * bundles, and importing from `node:crypto` — even type-only — would force
 * every frontend to depend on `@types/node`.
 *
 * This is a shape hint, not a guarantee. Validation happens at the edge with
 * `@IsUUID()` on the request DTO.
 */
export type UUID = `${string}-${string}-${string}-${string}-${string}`;
