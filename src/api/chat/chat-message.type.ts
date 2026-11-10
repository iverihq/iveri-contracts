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
}

export interface EditChatMessageRequest {
    body: string;
}

export interface ReactToChatMessageRequest {
    emoji: string;
}

export interface MarkChatReadRequest {
    /** Everything up to and including this sequence number has been read. */
    seq: number;
}
