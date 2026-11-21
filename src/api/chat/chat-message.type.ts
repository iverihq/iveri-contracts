import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ChatAttachment, ChatImage } from './chat-attachment.type.js';
import type { ChatMessageKind } from './chat-message-kind.enum.js';

export interface ChatMessageSender {
    userId: UUID;
    /** The name this conversation shows: a product's label for an embedded one. */
    displayName: string;
    avatar: Nullable<ChatImage>;
}

/** The message a reply points at, enough to draw the quote above it. */
export interface ChatReplyPreview {
    id: UUID;
    seq: number;
    senderName: Nullable<string>;
    kind: ChatMessageKind;
    excerpt: Nullable<string>;
    isDeleted: boolean;
}

/** Somebody a message names with `@`, under the name this conversation shows them by. */
export interface ChatMention {
    userId: UUID;
    displayName: string;
}

export interface ChatReactionSummary {
    emoji: string;
    count: number;
    isMine: boolean;
}

export interface ChatMessage {
    id: UUID;
    conversationId: UUID;
    /** Consecutive within a conversation, so "everything after 41" misses nothing. */
    seq: number;
    /** The client's own id for this message, so a retry is recognised. */
    clientMessageId: Nullable<UUID>;
    /** Null for a system notice. */
    sender: Nullable<ChatMessageSender>;
    kind: ChatMessageKind;
    /** Null once deleted for everyone, and for a system notice. */
    body: Nullable<string>;
    /** A system notice is a translation key with variables, never free text. */
    systemKey: Nullable<string>;
    systemVariables: Nullable<Record<string, string>>;
    replyTo: Nullable<ChatReplyPreview>;
    attachments: ChatAttachment[];
    reactions: ChatReactionSummary[];
    /**
     * The people this message names with `@`, each still in the conversation when it was sent. The body carries
     * `@` and the name as typed; a client draws each `@displayName` it finds here as a mention.
     */
    mentions: ChatMention[];
    /** Set while the message is pinned at the top of its conversation. */
    pinnedAt: Nullable<IsoDateTime>;
    isOwn: boolean;
    editedAt: Nullable<IsoDateTime>;
    isDeleted: boolean;
    sentAt: IsoDateTime;
}

/** A page of messages, oldest first. */
export interface ChatMessagePage {
    messages: ChatMessage[];
    /** Whether there is anything older than the first message on this page. */
    hasOlder: boolean;
    /** The conversation's newest sequence number when the page was read. */
    lastSeq: number;
}

export interface SendChatMessageRequest {
    /** Chosen by the client per message. A second send with the same id returns the first message. */
    clientMessageId: UUID;
    body?: Nullable<string>;
    replyToMessageId?: Nullable<UUID>;
    attachmentIds?: UUID[];
    /**
     * The people the body names with `@`. Anybody not present in the conversation is dropped, never refused, so a
     * name somebody left with does not fail the send. At most `CHAT_MENTIONS_PER_MESSAGE`.
     */
    mentionUserIds?: UUID[];
}

export interface EditChatMessageRequest {
    body: string;
    /** Replaces the message's mentions. Omitted keeps them as they were. */
    mentionUserIds?: UUID[];
}

/** A pinned message as the bar over a conversation draws it. */
export interface ChatPinnedMessage {
    id: UUID;
    seq: number;
    senderName: Nullable<string>;
    kind: ChatMessageKind;
    excerpt: Nullable<string>;
    pinnedAt: IsoDateTime;
    /** Who pinned it, under the name this conversation shows them by. */
    pinnedByName: Nullable<string>;
}

export interface ReactToChatMessageRequest {
    emoji: string;
}

export interface MarkChatReadRequest {
    /** Everything up to and including this sequence number has been read. */
    seq: number;
}
