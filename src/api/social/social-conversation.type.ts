import type { UUID } from '../../type/uuid.type.js';

/**
 * `POST /conversations`: open, or return, the conversation with another member.
 *
 * Ezo decides whether these two may talk; Baasi, Iveri's messenger, holds what they say.
 */
export interface StartSocialConversationRequest {
    memberId: UUID;
}

/** The Baasi conversation for a pair of members, read and written through `@iveri/chat-kit`. */
export interface SocialConversationHandle {
    conversationId: UUID;
}
