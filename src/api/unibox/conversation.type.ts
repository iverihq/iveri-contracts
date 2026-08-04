import type { CursorPage } from '../../type/cursor-page.type.js';
import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ChannelPlatform } from './channel-platform.enum.js';
import type { ConversationStatus } from './conversation-status.enum.js';
import type { Message } from './message.type.js';

/**
 * One thread between a tenant and a contact, on one channel.
 *
 * **One open conversation per `(channel, contact)`, never more.** A second one would split a
 * person's history in half at the exact moment two agents are both replying, and the customer
 * would see one conversation while the inbox showed two. A closed conversation reopens on the
 * next inbound message rather than a new row being created, for the same reason.
 *
 * The denormalized fields below — `contactDisplayName`, `lastMessagePreview`, `unreadCount` — are
 * here because an inbox list renders fifty of these at once and joining to messages for each one
 * is the query that makes the product feel slow. They are maintained in the same transaction as
 * the message that changes them, so they cannot drift.
 */
export interface Conversation {
    id: UUID;

    channelId: UUID;

    /** Snapshotted so the list renders without a join. */
    channelKey: string;
    platform: ChannelPlatform;

    contactId: UUID;
    contactDisplayName: string;

    status: ConversationStatus;

    /** The agent responsible. Null means unassigned, which is a queue an inbox filters on. */
    assigneeUserId: Nullable<UUID>;

    /** The team it was routed to, if any. Independent of the assignee. */
    teamId: Nullable<UUID>;

    /**
     * Messages the contact sent that no agent has opened.
     *
     * Per conversation, not per agent. A shared inbox is shared: two agents looking at the same
     * queue should see the same numbers, and per-agent unread counts turn "has anyone dealt with
     * this" into a question the UI cannot answer.
     */
    unreadCount: number;

    /** First ~200 characters of the last message, for the list. Null on an empty conversation. */
    lastMessagePreview: Nullable<string>;

    /** Sorts the inbox. Null only for a conversation created before its first message. */
    lastMessageAt: Nullable<IsoDateTime>;

    /** When the contact last said something. Drives "waiting on us" without reading the messages. */
    lastInboundAt: Nullable<IsoDateTime>;

    /** Set only while `SNOOZED`. The conversation returns to `OPEN` at this time. */
    snoozedUntil: Nullable<IsoDateTime>;

    /**
     * When a human took over from the AI, and who.
     *
     * §12 makes handover a launch requirement, and these two fields are what make it a fact rather
     * than a convention: once set, `unibox-ai` must not answer in this conversation again. Nothing
     * writes them from an AI side yet, and the guarantee is the same either way — the flag is what
     * a future agent loop reads, and it exists before there is a loop to read it.
     */
    handedOverAt: Nullable<IsoDateTime>;
    handedOverToUserId: Nullable<UUID>;

    closedAt: Nullable<IsoDateTime>;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/** One conversation with the head of its thread, for a detail view that opens in one request. */
export interface ConversationWithMessages {
    conversation: Conversation;

    /** Newest first, same order as `MessagesPage`. */
    messages: Message[];

    /** Cursor for the next (older) page, or null when the thread is fully loaded. */
    nextCursor: Nullable<string>;
}

/** `GET /api/v1/conversations`. Cursor-paged — this is the busiest list in the product. */
export type ConversationsPage = CursorPage<Conversation>;

/**
 * Query for `GET /api/v1/conversations` — the inbox itself.
 *
 * Every filter is optional and they compose with AND. `assigneeUserId` accepting the literal
 * `'unassigned'` is the one piece of overloading here, and it earns its place: "nobody has picked
 * this up" is the single most-used view in a shared inbox, and expressing it as a separate boolean
 * would make it silently combine with an assignee filter that contradicts it.
 */
export interface GetConversationsQuery {
    limit?: number;

    /** Opaque cursor from the previous page's `nextCursor`. Never parse it. */
    after?: Nullable<string>;

    status?: Nullable<ConversationStatus>;

    /** A user id, or `'unassigned'`. */
    assigneeUserId?: Nullable<string>;

    teamId?: Nullable<UUID>;

    channelId?: Nullable<UUID>;

    platform?: Nullable<ChannelPlatform>;

    /** Only conversations with at least one unread inbound message. */
    hasUnread?: Nullable<boolean>;

    /** Case-insensitive substring of the contact's display name. */
    search?: Nullable<string>;
}

/**
 * `PATCH /api/v1/conversations/:id/status`.
 *
 * Its own endpoint rather than a field on a general update, because a status change is an event
 * with side effects — closing stamps `closedAt` and writes a system message, snoozing schedules a
 * reopen — and folding it into a PATCH that also renames things makes those side effects a
 * surprise.
 */
export interface UpdateConversationStatusBody {
    status: ConversationStatus;

    /** Required when `status` is `snoozed`, refused otherwise. Must be in the future. */
    snoozedUntil?: Nullable<IsoDateTime>;
}

/**
 * `PATCH /api/v1/conversations/:id/assignee`.
 *
 * `null` unassigns, which is a deliberate act and not the absence of one — hence a body with an
 * explicitly nullable field rather than an optional one. Assigning to a user who is not an active
 * member of the tenant is refused: identity is the authority on who exists, and an inbox that can
 * assign work to a removed employee is an inbox with invisible work in it.
 */
export interface UpdateConversationAssigneeBody {
    assigneeUserId: Nullable<UUID>;

    /** Set the routing team at the same time. Omit to leave it alone; `null` clears it. */
    teamId?: Nullable<UUID>;
}

/**
 * `POST /api/v1/conversations/:id/handover` — a human takes over.
 *
 * Idempotent: taking over a conversation already handed over to you is a no-op rather than an
 * error, because the button will be pressed twice and the second press must not read as a failure.
 * Taking over one handed to *somebody else* reassigns it and says so in the thread.
 */
export interface HandoverConversationBody {
    /** Defaults to the caller. Naming someone else is a handover *to* them. */
    userId?: Nullable<UUID>;
}
