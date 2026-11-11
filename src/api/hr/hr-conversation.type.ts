import type { UUID } from '../../type/uuid.type.js';

/** `POST /me/conversations`: a colleague's employee id. */
export interface StartHrConversationRequest {
    employeeId: UUID;
}

/**
 * The Baasi conversation HR opened or found for two colleagues. The kit opens it by this id; HR keeps no
 * message of its own.
 */
export interface HrConversationHandle {
    conversationId: UUID;
}
