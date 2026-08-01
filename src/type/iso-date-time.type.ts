/**
 * An ISO-8601 timestamp as it appears on the wire: `2026-08-02T09:41:17.312Z`.
 *
 * **JSON has no date type**, so every timestamp a service sends is a string, whatever the
 * entity behind it holds. Naming that is not pedantry — it is the single most reliable way to
 * hand-retype a backend response wrongly. A frontend interface declaring `receivedAt: Date`
 * compiles, and every `receivedAt.getTime()` throws at runtime against a value that is really
 * a string. `conduit-admin-web` called this out in a comment and got it right by hand; the
 * point of putting the shapes in this package is that nobody has to.
 *
 * It is an alias, not a branded type, deliberately. A brand would force a cast at every
 * boundary where a string arrives from `JSON.parse` — which is all of them — and buy nothing,
 * since the value genuinely is an unvalidated string until someone parses it. What this alias
 * carries is the instruction: to get a `Date`, write `new Date(value)`.
 */
export type IsoDateTime = string;
