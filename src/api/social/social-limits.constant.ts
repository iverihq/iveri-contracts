/** Limits a form and the API have to agree on. */
export const SOCIAL_LIMITS = {
    HANDLE_MIN: 3,
    HANDLE_MAX: 30,
    DISPLAY_NAME_MAX: 60,
    BIO_MAX: 300,
    WEBSITE_MAX: 300,
    CAPTION_MAX: 2200,
    COMMENT_MAX: 1000,
    STORY_CAPTION_MAX: 200,
    MESSAGE_MAX: 2000,
    ALT_TEXT_MAX: 500,
    POST_IMAGES_MAX: 10,
    REPORT_DETAIL_MAX: 1000,
    APPEAL_STATEMENT_MAX: 2000,
    MODERATION_NOTE_MAX: 2000,
    IMAGE_BYTES_MAX: 15 * 1024 * 1024,
    MINIMUM_AGE: 16,
} as const;

/** The characters a handle may use, in the form they are stored. */
export const SOCIAL_HANDLE_PATTERN = /^[a-z0-9](?:[a-z0-9._]*[a-z0-9])?$/;

/** The version of the terms a new member accepts. A placeholder until the real terms exist. */
export const SOCIAL_TERMS_VERSION = '2026-11-draft';
