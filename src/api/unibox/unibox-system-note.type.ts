import type { UUID } from '../../type/uuid.type.js';

import type { ConversationStatus } from './conversation-status.enum.js';

/**
 * The kinds of line `unibox-api` writes into a thread itself, rather than an agent or a contact.
 *
 * An inbox read in Georgian cannot show a sentence the API composed in English, so the API says **what happened** and
 * the client words it. The English `text` is still written beside it, for an export, a log and any client that does not
 * know this list.
 */
export enum UniboxNoteKind {
    /** An agent moved the conversation to another status. Carries `status`. */
    STATUS_CHANGED = 'status-changed',
    /** The conversation was handed to a person. Carries `toUserId`. */
    HANDED_OVER = 'handed-over',
    /** A snooze ran out and the conversation came back to the inbox as open. */
    SNOOZE_ENDED = 'snooze-ended',
}

export interface UniboxStatusChangedNote {
    kind: UniboxNoteKind.STATUS_CHANGED;

    /** The status the conversation moved to. */
    status: ConversationStatus;
}

export interface UniboxHandedOverNote {
    kind: UniboxNoteKind.HANDED_OVER;

    /** The identity user the conversation was handed to. A client names them; it never prints the id. */
    toUserId: UUID;
}

export interface UniboxSnoozeEndedNote {
    kind: UniboxNoteKind.SNOOZE_ENDED;
}

/**
 * What a system line in a thread says, as data.
 *
 * **A client that meets a `kind` it does not know shows the message's `text`**, so a new kind can ship in the API
 * before every client has a sentence for it.
 */
export type UniboxSystemNote = UniboxStatusChangedNote | UniboxHandedOverNote | UniboxSnoozeEndedNote;
