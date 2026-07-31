import type { Nullable } from './nil.type.js';

/**
 * A cursor-paginated slice of a collection.
 *
 * The default for anything that grows while it is being read — delivery logs,
 * captures, conversation messages. A cursor is anchored to a row rather than a
 * position, so inserts during paging cannot make the reader skip or repeat.
 *
 * The cursor is an **opaque** string. Callers pass it back verbatim and never
 * parse it; its encoding is an implementation detail of the service that issued
 * it and may change without a version bump.
 *
 * @typeParam T - the element type of a single row.
 */
export interface CursorPage<T> {
    /** The rows for this page, in the requested order. */
    items: T[];

    /** Cursor to pass as `after` for the next page, or `null` when the end is reached. */
    nextCursor: Nullable<string>;

    /**
     * Whether another page exists. Equivalent to `nextCursor !== null`, exposed
     * separately so UI code can render a "load more" affordance without
     * reasoning about the cursor at all.
     */
    hasMore: boolean;
}
