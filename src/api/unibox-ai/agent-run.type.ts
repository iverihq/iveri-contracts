import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { ConversationStatus } from '../unibox/conversation-status.enum.js';
import type { MessageAuthorType } from '../unibox/message-author-type.enum.js';
import type { MessageContentType } from '../unibox/message-content-type.enum.js';

/** A bounded message snapshot supplied to the agent runtime for one run. */
export interface AgentContextMessage {
    id: UUID;
    authorType: MessageAuthorType;
    contentType: MessageContentType;
    text: Nullable<string>;
    sentAt: IsoDateTime;
}

/**
 * `POST /api/v1/agent-runs`.
 *
 * The tenant is derived from the authenticated principal, never from this body. A non-null
 * `handedOverAt` is authoritative: the runtime acknowledges the request without generating.
 */
export interface AgentRunRequest {
    conversationId: UUID;
    triggerMessageId: UUID;
    contactDisplayName: string;
    conversationStatus: ConversationStatus;
    handedOverAt: Nullable<IsoDateTime>;
    messages: AgentContextMessage[];
}

export enum AgentRunStatus {
    ACCEPTED = 'accepted',
    HANDED_OVER = 'handed_over',
}

/** The acceptance response; generation and delivery are separate later stages. */
export interface AgentRunAcceptedResponse {
    runId: UUID;
    status: AgentRunStatus;
    acceptedAt: IsoDateTime;
}
