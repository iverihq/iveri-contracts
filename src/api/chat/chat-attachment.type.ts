import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ChatAttachmentKind } from './chat-attachment-kind.enum.js';

/** A photograph's two sizes. The addresses are signed for this reader and expire. */
export interface ChatImage {
    url: string;
    thumbnailUrl: string;
    width: number;
    height: number;
}

export interface ChatAttachment {
    id: UUID;
    kind: ChatAttachmentKind;
    /** Signed for this reader. A file is served as a download, never rendered inline. */
    url: string;
    /** A photograph's small size. */
    thumbnailUrl: Nullable<string>;
    fileName: string;
    contentType: string;
    sizeBytes: number;
    width: Nullable<number>;
    height: Nullable<number>;
    /** A voice note's length. */
    durationMs: Nullable<number>;
    /** A voice note's shape, up to 64 levels between 0 and 100, computed by the recording client. */
    waveform: Nullable<number[]>;
}

/**
 * What `POST /attachments` takes besides the file. Voice-note fields are the client's measurements and
 * are only used to draw the note; the server checks the length it can read from the file itself.
 */
export interface UploadChatAttachmentFields {
    kind: ChatAttachmentKind;
    durationMs?: number;
    waveform?: string;
}
