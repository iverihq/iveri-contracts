import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { Paginated } from '../../type/paginated.type.js';
import type { UUID } from '../../type/uuid.type.js';

/**
 * An immutable snapshot of one namespace, at every active locale, at one moment.
 *
 * **This is what makes the service safe to depend on.** Without it, editing a translation changes
 * production text the instant it is saved — so a translator experimenting at 2am is a deploy, an
 * unfinished sentence is an outage, and there is no way to answer "what did this say last
 * Tuesday". With it, editing is free and publishing is the decision, gated by its own permission.
 *
 * The snapshot is stored in full rather than reconstructed from the translation rows by
 * timestamp. Reconstruction sounds cheaper and is wrong: a message archived after the release, or
 * a variable renamed, changes what the reconstruction produces, so a consumer pinned to version 3
 * would silently get different bytes next month.
 */
export interface Release {
    id: UUID;

    namespaceId: UUID;
    namespaceKey: string;

    /** Monotonic per namespace, starting at 1. What a consumer pins. */
    version: number;

    /** What changed and why, for whoever reads the history. */
    notes: Nullable<string>;

    /** Locales the snapshot contains — the active ones at publish time, not necessarily now. */
    localeCodes: string[];

    messageCount: number;

    /** Null when published by a service principal. */
    publishedByUserId: Nullable<UUID>;
    publishedAt: IsoDateTime;
}

/** `GET /api/v1/namespaces/:key/releases`. Newest first. */
export type ReleasesPage = Paginated<Release>;

/** `POST /api/v1/namespaces/:key/releases`. */
export interface PublishReleaseBody {
    notes?: Nullable<string>;
}

/**
 * `GET /api/v1/namespaces/:key/releases/preview` — what publishing right now would change.
 *
 * Shown before the button is pressed. A publish is irreversible in the sense that matters — the
 * consumers pull it — so the operator gets to see the diff first rather than discovering it in
 * production.
 */
export interface ReleaseDiff {
    namespaceKey: string;

    /** The version this would become. */
    nextVersion: number;

    /** Null when nothing has been published yet, in which case everything reads as added. */
    previousVersion: Nullable<number>;

    entries: ReleaseDiffEntry[];

    /**
     * Messages with no publishable translation in a locale that is active.
     *
     * Not an error — a release ships with gaps and the consumer falls back. It is surfaced
     * because shipping a gap should be a choice someone made, not one they made by not looking.
     */
    untranslated: UntranslatedEntry[];
}

export interface ReleaseDiffEntry {
    messageKey: string;
    localeCode: string;
    change: 'added' | 'changed' | 'removed';
    previousValue: Nullable<string>;
    nextValue: Nullable<string>;
}

export interface UntranslatedEntry {
    messageKey: string;
    localeCode: string;
    /** Where the fallback chain lands, or null if it falls off the end and the key renders raw. */
    fallsBackTo: Nullable<string>;
}
