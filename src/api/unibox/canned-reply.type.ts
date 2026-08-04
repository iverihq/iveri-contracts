import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { Paginated } from '../../type/paginated.type.js';
import type { UUID } from '../../type/uuid.type.js';

/**
 * A saved reply an agent can insert into a message.
 *
 * **Inserted into the composer, never sent by itself.** A canned reply is text an agent chooses
 * and can edit before sending — it is not an automation, and there is no endpoint that sends one
 * directly. That line is what keeps this out of §14's no-scripting territory: the moment a saved
 * reply can fire on a condition, we have built a rules engine in a chat product.
 */
export interface CannedReply {
    id: UUID;

    /** What an agent types to find it, e.g. `/hours`. Unique within the tenant. */
    shortcut: string;

    title: string;

    /**
     * The text, with `{{placeholders}}` substituted client-side at insert time.
     *
     * Substitution is the client's job on purpose. The server would have to resolve them at send
     * time, which means an agent could send a message whose final text they never saw — and the
     * one thing an agent must always be able to do is read what they are about to send.
     */
    body: string;

    /** For grouping in the picker. Null is the ungrouped bucket. */
    category: Nullable<string>;

    createdByUserId: Nullable<UUID>;

    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/** `GET /api/v1/canned-replies`. Offset-paged. */
export type CannedRepliesPage = Paginated<CannedReply>;

/** `POST /api/v1/canned-replies`. */
export interface CreateCannedReplyBody {
    /** Lowercase, `[a-z0-9-]`, no leading slash — the UI supplies that. */
    shortcut: string;
    title: string;
    body: string;
    category?: Nullable<string>;
}

/** `PATCH /api/v1/canned-replies/:id`. */
export interface UpdateCannedReplyBody {
    shortcut?: string;
    title?: string;
    body?: string;
    category?: Nullable<string>;
}
