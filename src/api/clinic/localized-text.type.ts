/**
 * Clinic-written text in each language it has been written in, keyed by locale.
 *
 * This is the clinic's own content, so it lives on the row it describes rather than in the
 * localization service, which holds strings the product's authors wrote.
 */
export type LocalizedText = Record<string, string>;
