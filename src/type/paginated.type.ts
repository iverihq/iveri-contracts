/**
 * An offset-paginated slice of a collection.
 *
 * Use this where the client needs to jump to an arbitrary page or show a total
 * count. Where the collection is large, append-only, or mutating under the
 * reader (delivery logs, captures, messages), prefer `CursorPage<T>` — offset
 * paging over a moving list skips and repeats rows.
 *
 * @typeParam T - the element type of a single row.
 */
export interface Paginated<T> {
    /** The rows for the requested page, in the requested order. */
    items: T[];

    /** Total rows matching the query across every page, ignoring `limit`/`offset`. */
    total: number;

    /** Maximum rows the caller asked for. `items.length` may be smaller on the last page. */
    limit: number;

    /** Rows skipped before this page. Zero-based. */
    offset: number;
}
