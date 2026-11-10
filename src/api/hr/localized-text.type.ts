/**
 * Text written in each language it has been written in, keyed by locale.
 *
 * Used for what ships in three languages and a company may change, such as a leave type or a
 * public holiday. What a company types for its own staff, such as a department, is plain text.
 */
export type LocalizedText = Record<string, string>;
