/**
 * What kind of thing a message carries.
 *
 * A small closed set that every platform can be normalized into, rather than a union of what each
 * one supports. A per-platform vocabulary would put "is this an Instagram story reply or a
 * WhatsApp interactive button" in front of the inbox UI, and the inbox's whole promise is that it
 * does not care.
 */
export enum MessageContentType {
    TEXT = 'text',
    IMAGE = 'image',
    VIDEO = 'video',
    AUDIO = 'audio',
    /** A file — PDF, spreadsheet, anything not one of the media types above. */
    DOCUMENT = 'document',
    LOCATION = 'location',
    /** A sticker or a bare emoji reaction, kept distinct so it can be rendered small. */
    STICKER = 'sticker',

    /**
     * Something arrived that this version cannot represent.
     *
     * **A first-class member, not an error.** A message we cannot render is still evidence that
     * the contact said something, and dropping it leaves an agent replying to a gap. The raw
     * provider payload is retained on the message so the same row can be re-read once a
     * normalizer learns the type.
     */
    UNSUPPORTED = 'unsupported',
}
