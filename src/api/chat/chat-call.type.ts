import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ChatImage } from './chat-attachment.type.js';
import type { ChatCallEndReason } from './chat-call-end-reason.enum.js';
import type { ChatCallKind } from './chat-call-kind.enum.js';
import type { ChatCallParticipantState } from './chat-call-participant-state.enum.js';
import type { ChatCallStatus } from './chat-call-status.enum.js';

/** Somebody in a call, named the way the conversation names them. */
export interface ChatCallParticipant {
    userId: UUID;
    displayName: string;
    avatar: Nullable<ChatImage>;
    state: ChatCallParticipantState;
    joinedAt: Nullable<IsoDateTime>;
    leftAt: Nullable<IsoDateTime>;
    isMe: boolean;
}

/**
 * `GET /calls/:callId`. Who rang whom, and what happened. Nothing of what was said or shown: the call server
 * carries the media and Baasi keeps none of it.
 */
export interface ChatCall {
    id: UUID;
    conversationId: UUID;
    kind: ChatCallKind;
    status: ChatCallStatus;
    /** Set once the call has ended, and only then. */
    endReason: Nullable<ChatCallEndReason>;
    startedBy: UUID;
    participants: ChatCallParticipant[];
    /** When an unanswered call stops ringing and becomes missed. */
    ringExpiresAt: IsoDateTime;
    answeredAt: Nullable<IsoDateTime>;
    endedAt: Nullable<IsoDateTime>;
    createdAt: IsoDateTime;
}

/** `POST /conversations/:conversationId/calls`. */
export interface StartChatCallRequest {
    kind: ChatCallKind;
    /** So a retried start rings once. Unique per caller. */
    clientCallId: UUID;
}

/**
 * What a client needs to connect to the call server: the address and a token for this one call, valid only long
 * enough to connect. Answered by starting a call, accepting one and `POST /calls/:callId/join` after a dropped
 * connection.
 */
export interface ChatCallJoin {
    call: ChatCall;
    url: string;
    token: string;
    expiresAt: IsoDateTime;
}

/** `GET /conversations/:conversationId/calls/current`: the call ringing or under way there, if any. */
export interface ChatCurrentCall {
    call: Nullable<ChatCall>;
}
