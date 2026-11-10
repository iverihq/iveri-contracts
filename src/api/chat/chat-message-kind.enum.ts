/** What a message carries. `system` is a notice written by a product or by Baasi itself, never by a person. */
export enum ChatMessageKind {
    TEXT = 'text',
    PHOTO = 'photo',
    FILE = 'file',
    VOICE = 'voice',
    SYSTEM = 'system',
}
