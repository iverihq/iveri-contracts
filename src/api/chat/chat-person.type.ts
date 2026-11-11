import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ChatImage } from './chat-attachment.type.js';
import type { ChatPersonStatus } from './chat-person-status.enum.js';

/** Somebody as another person sees them. Nothing here is an email address or a phone number. */
export interface ChatPersonCard {
    userId: UUID;
    /** The id an outside app knows this person by. Null for everybody signed in through Iveri. */
    externalId: Nullable<string>;
    displayName: string;
    /** Only in the Baasi network. A person inside a product has none. */
    handle: Nullable<string>;
    avatar: Nullable<ChatImage>;
    /** Null when they hide it, or when the reader shares no conversation with them. */
    lastActiveAt: Nullable<IsoDateTime>;
}

export interface ChatSettings {
    /** Whether people who share a conversation with me can see when I was last active. */
    showLastActive: boolean;
    /** Whether my read state is shown in one-to-one conversations. */
    sendReadReceipts: boolean;
}

/** The signed-in person's own profile. */
export interface ChatProfile {
    userId: UUID;
    /** The id an outside app knows me by. Null for everybody signed in through Iveri. */
    externalId: Nullable<string>;
    /** True in the Baasi tenant. Elsewhere a person only uses conversations their product opened. */
    isNetwork: boolean;
    /** False until a Baasi person has chosen a handle and a name. */
    hasProfile: boolean;
    handle: Nullable<string>;
    displayName: Nullable<string>;
    bio: Nullable<string>;
    avatar: Nullable<ChatImage>;
    status: ChatPersonStatus;
    /** Set while suspended or banned, translated by the client. */
    sanctionReasonKey: Nullable<string>;
    suspendedUntil: Nullable<IsoDateTime>;
    settings: ChatSettings;
    /** The personal invitation code, which anybody can use to start a conversation with me. */
    inviteCode: Nullable<string>;
}

export interface CreateChatProfileRequest {
    handle: string;
    displayName: string;
}

export interface UpdateChatProfileRequest {
    handle?: string;
    displayName?: string;
    bio?: Nullable<string>;
    /** An uploaded photo attachment. `null` removes the photograph. */
    avatarAttachmentId?: Nullable<UUID>;
    settings?: Partial<ChatSettings>;
}
