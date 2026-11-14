import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ChatDevicePlatform } from './chat-device-platform.enum.js';
import type { ChatPushTokenKind } from './chat-push-token-kind.enum.js';
import type { ChatRealtimeEvent } from './chat-realtime-event.enum.js';

/** What a socket receives. Identifiers only, and never a tenant id. */
export interface ChatRealtimeFrame {
    event: ChatRealtimeEvent;
    conversationId: Nullable<UUID>;
    /** The conversation's newest sequence number, so a client can tell whether it is behind. */
    seq: Nullable<number>;
    /** Who is typing. */
    userId: Nullable<UUID>;
    /**
     * On a `chat.conversation.typing` frame, whether that person started or stopped. Absent means started, which is
     * what every frame meant before stop frames existed.
     */
    isTyping?: boolean;
    /** The call a `chat.call.updated` frame is about. */
    callId?: Nullable<UUID>;
}

/** `PUT /me/devices`. One row per installation; signing out removes it. */
export interface RegisterChatDeviceRequest {
    installationId: string;
    platform: ChatDevicePlatform;
    pushToken: string;
    /** Omitted means `expo`, which is what every Iveri app holds. An app's own build may hold a raw APNs or FCM token. */
    tokenKind?: ChatPushTokenKind;
    locale?: Nullable<string>;
    /**
     * What rings this device for a call while the app is closed: an iOS PushKit VoIP token, or on Android the FCM
     * registration token. Expo cannot deliver either kind of push, so it is sent straight to Apple or Google.
     * Omitted leaves the stored one; null forgets it.
     */
    callPushToken?: Nullable<string>;
}
