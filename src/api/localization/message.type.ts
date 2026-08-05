import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { Paginated } from '../../type/paginated.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { TranslationStatus } from './translation-status.enum.js';
import type { VariableType } from './variable-type.enum.js';

/** One placeholder a message declares. See {@link VariableType} for why these are declared. */
export interface MessageVariable {
    /** The name inside the braces — `orderNumber` in `{orderNumber}`. `[a-zA-Z][a-zA-Z0-9]*`. */
    name: string;

    type: VariableType;

    /**
     * What it holds, in a sentence, for the translator.
     *
     * Worth more than it looks: a translator seeing `{count}` cannot tell whether it counts
     * unread messages or days remaining, and the two need different words in Georgian.
     */
    description: Nullable<string>;

    /** A representative value, used to preview the rendered string in the editor. */
    example: Nullable<string>;

    /**
     * For {@link VariableType.SELECT} only — the closed set of branches a translation may use.
     * A translation branching on anything outside it is rejected at write time.
     */
    options: Nullable<string[]>;
}

/**
 * A declaration as a *client sends* it, where the optional halves may simply be absent.
 *
 * A separate type from {@link MessageVariable} rather than that one with everything optional,
 * because the two directions genuinely differ: on the way in, omitting `description` means "I
 * have nothing to say"; on the way out, the field is always present and `null` says the same
 * thing explicitly. Collapsing them forces every reader to handle `undefined` for a field the
 * server always sends.
 */
export interface MessageVariableInput {
    name: string;
    type: VariableType;
    description?: Nullable<string>;
    example?: Nullable<string>;
    options?: Nullable<string[]>;
}

/**
 * A translatable string, identified by a key that never changes.
 *
 * The key is the contract with the consuming code: `t('inbox.conversation.assign')` is compiled
 * into an app, so renaming one is a breaking change to every release that already shipped. Keys
 * are therefore **immutable after creation** and retired by archiving, not by deletion.
 */
export interface Message {
    id: UUID;

    namespaceId: UUID;
    namespaceKey: string;

    /** Dotted, lowercase, `[a-z0-9.-]` — `inbox.conversation.assign`. Unique in the namespace. */
    key: string;

    /**
     * Where this string appears and what it is doing there.
     *
     * The highest-leverage field in the schema. A translator handed `Open` with no context cannot
     * know whether it is a button, an adjective describing a conversation, or a status label —
     * and those are three different Georgian words. Missing context is the main cause of
     * translations that are individually correct and collectively wrong.
     */
    description: Nullable<string>;

    variables: MessageVariable[];

    /**
     * Retired. Excluded from new releases, kept so an older pinned release still resolves and so
     * the translation work is not destroyed by a key that turns out to be still in use.
     */
    isArchived: boolean;

    /** Present on the detail response; omitted from the listing, which is already wide. */
    translations?: MessageTranslationSummary[];

    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/** One locale's standing on a message, as shown in a listing row. */
export interface MessageTranslationSummary {
    localeCode: string;
    /** `MISSING` here is synthesised — see {@link TranslationStatus}. */
    status: TranslationStatus;
    value: Nullable<string>;
    updatedAt: Nullable<IsoDateTime>;
}

/** `GET /api/v1/namespaces/:key/messages`. */
export type MessagesPage = Paginated<Message>;

/** `POST /api/v1/namespaces/:key/messages`. */
export interface CreateMessageBody {
    key: string;
    description?: Nullable<string>;
    variables?: MessageVariableInput[];
    /** The source-locale text. Written as an `APPROVED` translation in the same transaction. */
    sourceValue: string;
}

/**
 * `PATCH /api/v1/namespaces/:key/messages/:messageKey`.
 *
 * Editing `variables` is the sharp one: removing a declared variable invalidates every
 * translation still using it, so the service refuses the edit and names them rather than
 * silently leaving broken strings behind.
 */
export interface UpdateMessageBody {
    description?: Nullable<string>;
    variables?: MessageVariableInput[];
    isArchived?: boolean;
}
