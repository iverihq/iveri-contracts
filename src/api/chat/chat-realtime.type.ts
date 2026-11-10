import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ChatDevicePlatform } from './chat-device-platform.enum.js';
import type { ChatRealtimeEvent } from './chat-realtime-event.enum.js';

/** What a socket receives. Identifiers only, and never a tenant id. */
export interface ChatRealtimeFrame {
    event: ChatRealtimeEvent;
    conversationId: Nullable<UUID>;
    /** The conversation's newest sequence number, so a client can tell whether it is behind. */
    seq: Nullable<number>;
    /** Who is typing. */
    userId: Nullable<UUID>;
}

/** `POST /api/v1/frames` on `chat-realtime`, under `chat:realtime:publish`. The tenant is the caller's. */
export interface PublishChatFrameRequest {
    recipients: UUID[];
    frame: ChatRealtimeFrame;
}

export interface PublishChatFrameResponse {
    accepted: boolean;
}

/** `PUT /me/devices`. One row per installation; signing out removes it. */
export interface RegisterChatDeviceRequest {
    installationId: string;
    platform: ChatDevicePlatform;
    pushToken: string;
    locale?: Nullable<string>;
}
