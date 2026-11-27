/**
 * A delivery refusal a person can act on, sent as `details.reason` so a sender's or a courier's app says it in the
 * reader's language rather than showing the API's English. A company whose licence has lapsed is refused with the
 * platform's own `licence-inactive`, which is not repeated here.
 */
export enum DeliveryRefusal {
    /** The price was not accepted in time, so the delivery has to be requested again. */
    QUOTE_EXPIRED = 'quote-expired',
    /** A courier is being found or already has the parcel, so the delivery can no longer be cancelled. */
    NOT_CANCELLABLE = 'not-cancellable',
    /** The delivery has already moved past that step, or ended; refreshing shows where it stands. */
    JOB_MOVED_ON = 'job-moved-on',
    /** The delivery was given to another courier, or was never this courier's. */
    NOT_ASSIGNED_COURIER = 'not-assigned-courier',
    /** The proof photo is larger than the API takes; `details.maxMegabytes` says how large it may be. */
    PHOTO_TOO_LARGE = 'photo-too-large',
    /** The proof photo is neither a JPEG nor a PNG. */
    PHOTO_FORMAT = 'photo-format',
    /** The proof photo could not be read as an image. */
    PHOTO_UNREADABLE = 'photo-unreadable',
    /** The delivery already holds as many proof photos as it takes; `details.limit` says how many. */
    PHOTO_LIMIT = 'photo-limit',
    /** The same photo is still being stored, or its upload ran out of time; sending it again finishes it. */
    PHOTO_RETRY = 'photo-retry',
}
