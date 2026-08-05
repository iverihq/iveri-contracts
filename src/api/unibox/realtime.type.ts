import type { UUID } from '../../type/uuid.type.js';

import type { RealtimeConversationEvent } from './realtime-event.enum.js';

/** Socket.IO event names a client sends. */
export const REALTIME_CLIENT_EVENT = {
    SUBSCRIBE: 'realtime.subscribe',
    UNSUBSCRIBE: 'realtime.unsubscribe',
} as const;

/** Socket.IO event names a client receives. */
export const REALTIME_SERVER_EVENT = {
    READY: 'realtime.ready',
    SUBSCRIBED: 'realtime.subscribed',
    CONVERSATION_UPDATED: 'conversation.updated',
    ERROR: 'realtime.error',
} as const;

/** Bumped when a message shape changes incompatibly; the server announces it on connect. */
export const REALTIME_PROTOCOL_VERSION = 1;

/** Most conversations a single socket may watch. */
export const MAX_REALTIME_SUBSCRIPTIONS_PER_SOCKET = 100;

/** Largest serialized event, in bytes. */
export const MAX_REALTIME_EVENT_BYTES = 64 * 1024;

/** Longest event name accepted from a publisher. */
export const MAX_REALTIME_EVENT_NAME_LENGTH = 128;

/**
 * The body a publishing service POSTs to `unibox-realtime`.
 *
 * **There is no `tenantId` field, and that absence is the security model.** The tenant comes
 * from the publisher's own access token, so a compromised or buggy publisher cannot address
 * another tenant's subscribers — it can only ever reach its own. A body field would make
 * cross-tenant delivery a validation rule someone has to remember to write.
 */
export interface PublishConversationEventBody {
    conversationId: UUID;
    event: RealtimeConversationEvent;
    /** Identifiers only. Never message content — see {@link RealtimeConversationEvent}. */
    payload: Record<string, unknown>;
}

/** `unibox-realtime`'s answer to a publish. */
export interface PublishConversationEventResponse {
    /**
     * Whether the event was accepted for fan-out.
     *
     * Never whether anyone received it. With the Redis adapter no single process knows that, and
     * a publisher that waited to find out would be blocking a write on how many browsers happen
     * to be open.
     */
    accepted: boolean;
}

/** Sent to a client once its token verifies. */
export interface RealtimeReadyMessage {
    protocolVersion: typeof REALTIME_PROTOCOL_VERSION;
}

/** What a client asks to watch. Additive — the socket keeps what it already had. */
export interface RealtimeSubscribeRequest {
    conversationIds: UUID[];
}

/**
 * What a client asks to stop watching.
 *
 * Subscribing is additive and capped at {@link MAX_REALTIME_SUBSCRIPTIONS_PER_SOCKET}, so
 * without this a long-lived inbox that pages through conversations reaches the cap and then
 * silently stops receiving anything new. Unsubscribing what has scrolled out of view is what
 * keeps the set bounded by what is on screen rather than by everything ever looked at.
 */
export interface RealtimeUnsubscribeRequest {
    conversationIds: UUID[];
}

/** The full set a socket is watching after a subscribe, not just the delta. */
export interface RealtimeSubscribedMessage {
    conversationIds: UUID[];
}

export interface RealtimeErrorMessage {
    code: 'UNAUTHENTICATED' | 'FORBIDDEN' | 'INVALID_SUBSCRIPTION' | 'PAYLOAD_TOO_LARGE';
    message: string;
}

/**
 * What a subscribed client receives.
 *
 * **No tenant id.** The subscriber proved its own tenant to enter the room, so echoing it back
 * says nothing it does not know and puts another tenant's identifier one bug away from a socket
 * that must never see it.
 */
export interface ConversationUpdatedMessage {
    conversationId: UUID;
    event: RealtimeConversationEvent;
    payload: Record<string, unknown>;
}

/** Acknowledgement returned to a client's `subscribe` call. */
export type RealtimeSubscriptionAck =
    { ok: true; message: RealtimeSubscribedMessage } | { ok: false; message: RealtimeErrorMessage };
