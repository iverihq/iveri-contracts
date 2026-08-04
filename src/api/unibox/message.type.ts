import type { CursorPage } from '../../type/cursor-page.type.js';
import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { MessageAuthorType } from './message-author-type.enum.js';
import type { MessageContentType } from './message-content-type.enum.js';
import type { MessageDirection } from './message-direction.enum.js';
import type { MessageStatus } from './message-status.enum.js';

/** A file attached to a message. Media is referenced by provider URL until `iveri-files-api` exists. */
export interface MessageAttachment {
    contentType: MessageContentType;

    /**
     * Where the media lives.
     *
     * Today this is the provider's own URL, which for most platforms is short-lived and requires
     * the channel's credentials to fetch — so it is not something a browser can render directly.
     * Re-hosting is `iveri-files-api`'s job (build-order step 10 territory), and this field is
     * what will point at it instead.
     */
    url: Nullable<string>;

    /** The provider's media id, which is what a re-host job would need to fetch it. */
    externalMediaId: Nullable<string>;

    fileName: Nullable<string>;
    mimeType: Nullable<string>;
    sizeBytes: Nullable<number>;
}

/**
 * One message in a conversation.
 *
 * Immutable once written, apart from `status` and its timestamps. An inbox is a record of what was
 * said, and an editable one is not evidence of anything — which matters the first time a customer
 * disputes what they were told.
 */
export interface Message {
    id: UUID;

    conversationId: UUID;

    direction: MessageDirection;

    authorType: MessageAuthorType;

    /** The agent who wrote it. Null for anything not authored by a human. */
    authorUserId: Nullable<UUID>;

    contentType: MessageContentType;

    /** The text, or a caption on a media message. Null when there was none. */
    text: Nullable<string>;

    attachments: MessageAttachment[];

    status: MessageStatus;

    /** Why a `FAILED` message failed, in words an agent can act on. Null otherwise. */
    failureReason: Nullable<string>;

    /**
     * The provider's own message id.
     *
     * Inbound, this is the **idempotency key**: Conduit is at-least-once by design and a
     * redelivered webhook must not produce a second message. Outbound, it arrives with the
     * provider's acceptance and is what a later status webhook is matched against.
     */
    externalMessageId: Nullable<string>;

    /**
     * The Conduit dispatch this send was submitted as.
     *
     * Kept so a dead letter in Conduit's outbound DLQ can be traced back to the message an agent
     * is looking at. Conduit puts `x-conduit-dispatch-id` on every send for the same reason from
     * the other end.
     */
    dispatchId: Nullable<UUID>;

    /**
     * When the message was said, according to the provider — not when we stored it.
     *
     * These differ by however long a provider queued a webhook, which after an outage is hours.
     * Ordering the thread by arrival would then shuffle a conversation into nonsense, so this is
     * what the thread sorts on.
     */
    sentAt: IsoDateTime;

    deliveredAt: Nullable<IsoDateTime>;
    readAt: Nullable<IsoDateTime>;

    createdAt: IsoDateTime;
}

/**
 * `GET /api/v1/conversations/:id/messages`. Cursor-paged, **newest first**.
 *
 * Newest first because that is what a thread opens to, and because paging backwards through
 * history is the direction a scroll actually goes. The client reverses a page to render it.
 */
export type MessagesPage = CursorPage<Message>;

/** Query for `GET /api/v1/conversations/:id/messages`. */
export interface GetMessagesQuery {
    limit?: number;

    /** Opaque cursor from the previous page's `nextCursor`. Never parse it. */
    before?: Nullable<string>;
}

/**
 * `POST /api/v1/conversations/:id/messages` — an agent replying.
 *
 * Note what is absent: no channel, no recipient, no provider fields. The conversation already
 * knows which channel it is on and who the contact is, and letting a caller restate either would
 * be a way to send a message to one person through another person's thread.
 */
export interface SendMessageBody {
    /** The reply text. Required for `TEXT`; a caption otherwise. */
    text?: Nullable<string>;

    contentType?: Nullable<MessageContentType>;

    attachments?: Nullable<MessageAttachment[]>;

    /**
     * The caller's idempotency key, scoped to the conversation.
     *
     * **Strongly recommended, and forwarded to Conduit as its dispatch key.** Without one, an
     * agent double-clicking Send messages the customer twice — and unlike an inbound duplicate,
     * which is evidence, an outbound duplicate is a mistake the customer sees.
     */
    idempotencyKey?: Nullable<string>;
}

/**
 * `POST /api/v1/conversations/:id/notes` — a private note in the thread.
 *
 * A separate endpoint from sending rather than a flag on {@link SendMessageBody}, because the
 * difference between "the customer reads this" and "only we read this" must not be one boolean
 * away from being wrong. It also carries a different permission: writing a note is not sending.
 */
export interface AddNoteBody {
    text: string;
}
