/**
 * Where a posted video is between upload and playback.
 *
 * Only its author ever sees one that is not `ready`: a post carrying such a video is shown to nobody
 * else until processing finishes.
 */
export enum SocialVideoState {
    PROCESSING = 'processing',
    READY = 'ready',
    /** It could not be decoded or encoded. Nothing will change it; the author deletes the post. */
    FAILED = 'failed',
}
