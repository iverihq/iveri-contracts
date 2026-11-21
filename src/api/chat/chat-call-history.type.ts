import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ChatImage } from './chat-attachment.type.js';
import type { ChatCallDirection } from './chat-call-direction.enum.js';
import type { ChatCallEndReason } from './chat-call-end-reason.enum.js';
import type { ChatCallKind } from './chat-call-kind.enum.js';
import type { ChatCallStatus } from './chat-call-status.enum.js';
import type { ChatPersonCard } from './chat-person.type.js';

/**
 * One row of `GET /me/calls`: a call I started, was rung for or joined, newest first. Only who, when, how long and
 * how it ended; nothing of what was said.
 */
export interface ChatCallHistoryEntry {
    /** The call's id. */
    id: UUID;
    conversationId: UUID;
    kind: ChatCallKind;
    status: ChatCallStatus;
    endReason: Nullable<ChatCallEndReason>;
    direction: ChatCallDirection;
    isGroup: boolean;
    /** The group's title, or the other person's name as the conversation shows it. */
    title: string;
    avatar: Nullable<ChatImage>;
    /** The other person in a call between two. */
    other: Nullable<ChatPersonCard>;
    /** Rung, and never in it: I did not answer, declined, or it stopped ringing. Never true of my own call. */
    isMissed: boolean;
    /** From the answer to the end, in whole seconds; null until both. */
    durationSeconds: Nullable<number>;
    /** How many people reached the call. */
    participantCount: number;
    createdAt: IsoDateTime;
    endedAt: Nullable<IsoDateTime>;
}

export interface ChatCallHistoryPage {
    calls: ChatCallHistoryEntry[];
    /** Pass back as `cursor` for the next page. */
    nextCursor: Nullable<string>;
}

/** `GET /me/calls`. */
export interface ChatCallHistoryQuery {
    cursor?: string;
    limit?: number;
    /** Only the calls I missed. */
    missed?: boolean;
}
