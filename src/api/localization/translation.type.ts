import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { TranslationStatus } from './translation-status.enum.js';

/**
 * One message, in one locale.
 *
 * `value` is **ICU MessageFormat**, not a template string with our own placeholder syntax. That
 * choice is the reason this service can be correct in Russian: Russian selects between `one`,
 * `few`, `many` and `other` on the *numeric* value, and a hand-rolled `count === 1 ? a : b` is
 * wrong for 2, 5 and 21 in ways an English-speaking reviewer cannot see. ICU already encodes
 * every locale's plural rules, so the translation carries the branch and the code carries none.
 */
export interface Translation {
    id: UUID;

    messageId: UUID;
    messageKey: string;
    namespaceKey: string;
    localeCode: string;

    /** ICU MessageFormat. Validated against the message's declared variables on every write. */
    value: string;

    status: TranslationStatus;

    /** Null when written by a service principal rather than a person. */
    updatedByUserId: Nullable<UUID>;

    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/**
 * `PUT /api/v1/namespaces/:key/messages/:messageKey/translations/:localeCode`.
 *
 * An upsert rather than create/update, because a translator does not know or care whether a row
 * exists — `MISSING` is the absence of one, and making them discover that through a 404 would be
 * exposing our storage decision as a workflow step.
 */
export interface UpsertTranslationBody {
    value: string;
    /**
     * Defaults to `DRAFT`. Setting `APPROVED` requires the same permission as any other write —
     * approving is not separately gated, because the gate that matters is publishing.
     */
    status?: TranslationStatus;
}

/**
 * `POST /api/v1/namespaces/:key/translations/bulk` — one locale, many messages.
 *
 * The entries that validate are written together in one transaction; the ones that do not are
 * reported back. See {@link BulkUpsertTranslationsResult} for why it is not all-or-nothing.
 */
export interface BulkUpsertTranslationsBody {
    localeCode: string;
    entries: BulkTranslationEntry[];
}

export interface BulkTranslationEntry {
    messageKey: string;
    value: string;
    status?: TranslationStatus;
}

/**
 * The result of a bulk write.
 *
 * Rejections are returned per entry instead of failing the whole batch, because the usual caller
 * is an import of a file a translator produced elsewhere: refusing 400 good rows over one bad
 * placeholder means they have no way to make progress, and the failure they must fix is
 * precisely the one this names.
 */
export interface BulkUpsertTranslationsResult {
    written: number;
    rejected: RejectedTranslation[];
}

export interface RejectedTranslation {
    messageKey: string;
    reason: string;
}
