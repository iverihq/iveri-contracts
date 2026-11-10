import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { SocialImage } from './social-image.type.js';
import type { SocialMemberCard } from './social-member.type.js';

export interface SocialMessagePreview {
    excerpt: Nullable<string>;
    hasImage: boolean;
    isOwn: boolean;
    sentAt: IsoDateTime;
}

export interface SocialConversation {
    id: UUID;
    /** Null once the other person has left Ezo. */
    other: Nullable<SocialMemberCard>;
    /** Waiting for this member to accept it. */
    isRequest: boolean;
    unreadCount: number;
    lastMessage: Nullable<SocialMessagePreview>;
    /** Whether this member can send here now: false after a block or when the other has left. */
    canSend: boolean;
    /** Up to where the other person has read. Absent while a request is unanswered. */
    otherReadAt: Nullable<IsoDateTime>;
}

export interface SocialMessage {
    id: UUID;
    conversationId: UUID;
    /** Null once the sender has left Ezo. */
    senderId: Nullable<UUID>;
    body: Nullable<string>;
    image: Nullable<SocialImage>;
    isOwn: boolean;
    /** The sender took it back. */
    isDeleted: boolean;
    sentAt: IsoDateTime;
}

export interface StartSocialConversationRequest {
    memberId: UUID;
}

export interface SendSocialMessageRequest {
    /** Chosen by the client per message, so a retry cannot send it twice. */
    clientId: UUID;
    body?: Nullable<string>;
    mediaId?: Nullable<UUID>;
}
