import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ChatConversationKind } from './chat-conversation-kind.enum.js';
import type { ChatPersonCard } from './chat-person.type.js';

export interface ChatContact {
    person: ChatPersonCard;
    addedAt: IsoDateTime;
}

export interface AddChatContactRequest {
    userId: UUID;
}

export interface ChatBlock {
    person: ChatPersonCard;
    blockedAt: IsoDateTime;
}

/** What an invitation code leads to, shown before accepting it. */
export interface ChatInvitationPreview {
    code: string;
    kind: ChatConversationKind;
    /** A person's invitation names them. */
    person: Nullable<ChatPersonCard>;
    /** A group's invitation names it. */
    groupTitle: Nullable<string>;
    memberCount: Nullable<number>;
}

export interface AcceptChatInvitationResponse {
    conversationId: UUID;
}

export interface ChatMessageSearchHit {
    conversationId: UUID;
    conversationTitle: string;
    messageId: UUID;
    seq: number;
    senderName: Nullable<string>;
    excerpt: string;
    sentAt: IsoDateTime;
}
