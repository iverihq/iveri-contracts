import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ChatAppConversationMode } from './chat-app-conversation-mode.enum.js';
import type { CHAT_SOCKET_TICKET_TYPE } from './chat-app.constant.js';
import type { OpenEmbeddedChatRequest } from './chat-embed.type.js';
import type { ChatMessageKind } from './chat-message-kind.enum.js';
import type { ChatPersonStatus } from './chat-person-status.enum.js';

/**
 * Baasi inside another company's product. An app is its own Baasi tenant, so its users, conversations and
 * moderation queue are kept apart from every other app's, and its id is the `iss` of every token signed for it.
 */
export interface ChatApp {
    id: UUID;
    name: string;
    conversationMode: ChatAppConversationMode;
    /** Tokens signed before this moment are refused, for every user of the app. */
    tokensNotBefore: Nullable<IsoDateTime>;
    secrets: ChatAppSecretSummary[];
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/** A secret as it is listed afterwards: never the value, only enough to tell two apart. */
export interface ChatAppSecretSummary {
    id: UUID;
    /** The last four characters, so a person can tell which one a server holds. */
    hint: string;
    createdAt: IsoDateTime;
    revokedAt: Nullable<IsoDateTime>;
}

/** `POST /apps/:appId/secrets`. The only answer that ever holds the value: it is not stored readable. */
export interface CreatedChatAppSecret extends ChatAppSecretSummary {
    /** `bs_` and 32 random bytes in base64url. */
    secret: string;
}

export interface CreateChatAppRequest {
    name: string;
    /** Omitted means `server`: only the company's server opens conversations. */
    conversationMode?: ChatAppConversationMode;
}

export interface UpdateChatAppRequest {
    name?: string;
    conversationMode?: ChatAppConversationMode;
}

/** `PUT /server/users/:userId`, where `userId` is the app's own id for the person. */
export interface UpsertChatAppUserRequest {
    displayName: string;
    /** An address the app already serves publicly. `null` removes it. */
    avatarUrl?: Nullable<string>;
}

/** A user of an app, as its server sees them. */
export interface ChatAppUser {
    /** Baasi's own id for them, which every conversation and message names. */
    userId: UUID;
    externalId: string;
    displayName: Nullable<string>;
    avatarUrl: Nullable<string>;
    status: ChatPersonStatus;
    /** Their tokens signed before this moment are refused. */
    tokensNotBefore: Nullable<IsoDateTime>;
    createdAt: IsoDateTime;
}

/** `POST /server/tokens`. For a company that would rather not sign a token itself. */
export interface MintChatTokenRequest {
    /** The app's own id for the person, 1 to 255 characters. */
    userId: string;
    /** Omitted means an hour. At most a day. */
    ttlSeconds?: number;
}

export interface ChatToken {
    token: string;
    expiresAt: IsoDateTime;
}

/**
 * `PUT /server/conversations`: the embed request, with each participant's `userId` read as the app's own id for
 * them rather than a Baasi id.
 */
export type OpenServerChatRequest = OpenEmbeddedChatRequest;

/** `GET /server/users/:userId/export`: everything Baasi holds about one user of an app. */
export interface ChatAppUserExport {
    user: ChatAppUser;
    conversations: ChatAppUserExportConversation[];
    messages: ChatAppUserExportMessage[];
    reactions: ChatAppUserExportReaction[];
    devices: ChatAppUserExportDevice[];
    exportedAt: IsoDateTime;
}

export interface ChatAppUserExportConversation {
    conversationId: UUID;
    kind: string;
    title: Nullable<string>;
    context: Nullable<{ product: string; type: string; id: string }>;
    status: string;
    joinedAt: IsoDateTime;
}

export interface ChatAppUserExportMessage {
    messageId: UUID;
    conversationId: UUID;
    seq: number;
    kind: ChatMessageKind;
    text: Nullable<string>;
    attachmentCount: number;
    sentAt: IsoDateTime;
    editedAt: Nullable<IsoDateTime>;
    deletedAt: Nullable<IsoDateTime>;
}

export interface ChatAppUserExportReaction {
    messageId: UUID;
    emoji: string;
    reactedAt: IsoDateTime;
}

export interface ChatAppUserExportDevice {
    installationId: string;
    platform: string;
    locale: Nullable<string>;
    registeredAt: IsoDateTime;
}

/**
 * `POST /realtime/ticket`. What a socket presents to `chat-realtime` when the person signed in with an app's token,
 * so the app's secret stays in `chat-api`.
 */
export interface ChatSocketTicket {
    ticket: string;
    /** The presented token's own expiry: a ticket never outlives what it was traded for. */
    expiresAt: IsoDateTime;
}

/** A socket ticket's claims, signed HS256 with the secret `chat-api` and `chat-realtime` share. */
export interface ChatSocketTicketClaims {
    typ: typeof CHAT_SOCKET_TICKET_TYPE;
    /** The tenant: an app's id, or an Iveri tenant. */
    tid: UUID;
    /** The person's Baasi id. */
    sub: UUID;
    iat: number;
    exp: number;
}
