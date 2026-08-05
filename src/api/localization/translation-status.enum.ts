/**
 * Where a single translation stands, for one message in one locale.
 *
 * The states exist to answer one question a translator asks constantly — *what is left to do* —
 * and they are ordered by how much trust a reader may put in the value.
 *
 * `MISSING` is **not stored**. A translation row exists only once someone has written something,
 * so "missing" is the absence of a row projected into this enum by the read side. Storing it
 * would mean writing a row per message per locale the moment a key is created, which turns
 * adding one key into N writes and makes "has anyone touched this?" unanswerable.
 */
export enum TranslationStatus {
    /** No row exists. Synthesised by the read side so a listing can be filtered on it. */
    MISSING = 'missing',

    /** Someone is working on it. Excluded from a release unless the namespace allows drafts. */
    DRAFT = 'draft',

    /**
     * Written, but the source text changed underneath it.
     *
     * Set automatically when the source-locale value of the same message is edited — an English
     * label reworded from `Archive` to `Delete` leaves a Georgian translation that is
     * grammatically fine and now says the wrong thing. Nothing else in the system can catch that,
     * because the translation is still valid text.
     */
    NEEDS_REVIEW = 'needs-review',

    /** Reviewed and publishable. */
    APPROVED = 'approved',
}
