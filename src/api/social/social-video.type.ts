import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { SocialImageUrls } from './social-image.type.js';
import type { SocialVideoState } from './social-video-state.enum.js';

/**
 * A short video on a post.
 *
 * `url` and `posterUrls` are signed like a photograph's and are null until the video is `ready`.
 * Everybody but the author only ever receives a ready one.
 */
export interface SocialVideo {
    id: UUID;
    state: SocialVideoState;
    width: number;
    height: number;
    durationMs: number;
    /** A solid colour to paint while the poster loads. */
    placeholderColor: string;
    altText: Nullable<string>;
    /** The still shown before playing, in the three photograph sizes. */
    posterUrls: Nullable<SocialImageUrls>;
    /** One MP4 (H.264 and AAC) every browser and phone plays. */
    url: Nullable<string>;
}

/** What a video upload answers. It is decoded enough to be refused at once; encoding happens afterwards. */
export interface SocialVideoUpload {
    id: UUID;
    state: SocialVideoState;
    width: number;
    height: number;
    durationMs: number;
}
