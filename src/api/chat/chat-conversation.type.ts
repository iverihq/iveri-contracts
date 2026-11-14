import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ChatImage } from './chat-attachment.type.js';
import type { ChatConversationKind } from './chat-conversation-kind.enum.js';
import type { ChatMessageKind } from './chat-message-kind.enum.js';
import type { ChatParticipantRole } from './chat-participant-role.enum.js';
import type { ChatParticipantStatus } from './chat-participant-status.enum.js';
import type { ChatPersonCard } from './chat-person.type.js';
import type { ChatRefusal } from './chat-refusal.enum.js';

/** What an embedded conversation is about, in the product that opened it. */
export interface ChatContext {
    /** The product's own name for itself: `taxi`, `social`, `commerce`. */
    product: string;
    /** What in that product: `ride`, `direct`, `order`. */
    type: string;
    /** The product's own id for it. */
    id: string;
    /** Where the product shows it, relative to the product's own site or app. */
    link: Nullable<{ web: Nullable<string>; app: Nullable<string> }>;
}

export interface ChatLastMessagePreview {
    seq: number;
    kind: ChatMessageKind;
    /** Null when deleted, and for a system notice, whose key is given instead. */
    excerpt: Nullable<string>;
    systemKey: Nullable<string>;
    /**
     * A system notice's variables, as on the message itself (`{ actor, name, title, role }`), so an inbox row
     * can say "Nino created the group" rather than a sentence with holes. Null for anything but a notice.
     */
    systemVariables: Nullable<Record<string, string>>;
    senderName: Nullable<string>;
    isOwn: boolean;
    isDeleted: boolean;
    sentAt: IsoDateTime;
}

/** One row of an inbox. */
export interface ChatConversationSummary {
    id: UUID;
    kind: ChatConversationKind;
    /** A group's title, the other person's name in a one-to-one, the product's title in a context. */
    title: string;
    /** A line under the title, set by a product for a context conversation. */
    subtitle: Nullable<string>;
    avatar: Nullable<ChatImage>;
    /**
     * The other person in a one-to-one conversation, and in a product's conversation that holds two people and
     * is not a group.
     */
    other: Nullable<ChatPersonCard>;
    /**
     * A conversation of many: a Baasi group, or a product's conversation opened with `isGroup`. It is drawn under
     * its own title and never under one member's name, however many people are in it.
     */
    isGroup: boolean;
    context: Nullable<ChatContext>;
    memberCount: number;
    lastMessage: Nullable<ChatLastMessagePreview>;
    lastSeq: number;
    unreadCount: number;
    /** Waiting for me to accept it. */
    isRequest: boolean;
    mutedUntil: Nullable<IsoDateTime>;
    isPinned: boolean;
    isArchived: boolean;
    /** Whether I can send here now. When false, `refusal` says why. */
    canSend: boolean;
    refusal: Nullable<ChatRefusal>;
    /**
     * Whether I can call here now: the same people who may send, in a conversation that takes calls. A group takes
     * none yet, and a product's conversation only while the product allows it.
     */
    canCall: boolean;
    updatedAt: IsoDateTime;
}

export interface ChatParticipant {
    userId: UUID;
    /** The name this conversation shows, which a product may set. */
    displayName: string;
    /** A product's label: "Driver", "Shop". */
    label: Nullable<string>;
    handle: Nullable<string>;
    avatar: Nullable<ChatImage>;
    role: ChatParticipantRole;
    status: ChatParticipantStatus;
    /** Up to where they have read. Null while a request is unanswered or when they hide read state. */
    lastReadSeq: Nullable<number>;
    lastActiveAt: Nullable<IsoDateTime>;
    isMe: boolean;
}

export interface ChatConversation extends ChatConversationSummary {
    participants: ChatParticipant[];
    myRole: ChatParticipantRole;
    myLastReadSeq: number;
    writableUntil: Nullable<IsoDateTime>;
    closedAt: Nullable<IsoDateTime>;
    /** A group's invitation code, shown to its owner and admins. */
    inviteCode: Nullable<string>;
}

export interface ChatInboxPage {
    conversations: ChatConversationSummary[];
    /** Pass back as `cursor` for the next page. */
    nextCursor: Nullable<string>;
}

/** What `GET /conversations` can be narrowed to. */
export type ChatInboxFolder = 'inbox' | 'requests' | 'archived';

/**
 * Exactly one of the two. Inside an outside app that lets its users start conversations, a person names the
 * other by the app's own id for them, since that is the only id the app knows.
 */
export interface StartDirectChatRequest {
    userId?: UUID;
    externalUserId?: string;
}

/** Exactly one of the two lists, as with {@link StartDirectChatRequest}. */
export interface CreateGroupChatRequest {
    title: string;
    memberUserIds?: UUID[];
    memberExternalIds?: string[];
}

export interface UpdateGroupChatRequest {
    title?: string;
    /** An uploaded photo attachment. `null` removes the photograph. */
    avatarAttachmentId?: Nullable<UUID>;
}

/** Exactly one of the two lists, as with {@link StartDirectChatRequest}. */
export interface AddChatMembersRequest {
    userIds?: UUID[];
    externalUserIds?: string[];
}

export interface UpdateChatMemberRequest {
    role: ChatParticipantRole;
}

/** My own settings for one conversation. */
export interface UpdateMyChatSettingsRequest {
    /** `null` unmutes. A date far in the future mutes until unmuted. */
    mutedUntil?: Nullable<IsoDateTime>;
    isPinned?: boolean;
    isArchived?: boolean;
}

/**
 * `POST /conversations/:id/typing`. The body is optional: no body, or `isTyping` absent, means started. A stop clears
 * the server's start throttle, so the next start is passed on at once.
 */
export interface ChatTypingRequest {
    isTyping?: boolean;
}

export interface ChatTypingResponse {
    accepted: boolean;
}
