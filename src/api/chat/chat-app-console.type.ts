import type { CursorPage } from '../../type/cursor-page.type.js';
import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ChatAppUser } from './chat-app.type.js';
import type { ChatConversationKind } from './chat-conversation-kind.enum.js';

/** `GET /apps/:appId/users`. */
export type ChatAppUsersPage = CursorPage<ChatAppUser>;

/** Somebody in a conversation, as a console lists them: the app's id for them and the name they show. */
export interface ChatAppConversationParticipant {
    externalId: Nullable<string>;
    displayName: Nullable<string>;
}

/**
 * A conversation as a customer's console lists it: who is in it and when it was last used. **Never what it says**: a
 * console reads a conversation only through a report, the rule Baasi's own staff work under.
 */
export interface ChatAppConversationSummary {
    id: UUID;
    kind: ChatConversationKind;
    /** A group's own name, or the product's title for a conversation it opened. */
    title: Nullable<string>;
    context: Nullable<{ product: string; type: string; id: string }>;
    participants: ChatAppConversationParticipant[];
    lastActivityAt: IsoDateTime;
    closedAt: Nullable<IsoDateTime>;
    createdAt: IsoDateTime;
}

/** `GET /apps/:appId/conversations`. Most recently used first. */
export type ChatAppConversationsPage = CursorPage<ChatAppConversationSummary>;
