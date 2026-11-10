/** The longest message text, in characters. */
export const CHAT_MESSAGE_MAX_LENGTH = 4000;

/** The most people a group can hold, its owner included. */
export const CHAT_GROUP_MAX_MEMBERS = 256;

/** The longest group title. */
export const CHAT_GROUP_TITLE_MAX_LENGTH = 80;

/** How long after sending a message its author may still change it. */
export const CHAT_EDIT_WINDOW_HOURS = 48;

/** How long after sending a message its author may still delete it for everyone. */
export const CHAT_DELETE_WINDOW_HOURS = 48;

/** How many conversations one person can pin. */
export const CHAT_PIN_LIMIT = 5;

/** How many attachments one message can carry. */
export const CHAT_ATTACHMENTS_PER_MESSAGE = 10;

/** The longest voice note, in seconds. */
export const CHAT_VOICE_MAX_SECONDS = 300;

/** The largest upload, in bytes. */
export const CHAT_ATTACHMENT_MAX_BYTES = 25 * 1024 * 1024;

/** The reactions offered first. Any single emoji is accepted. */
export const CHAT_QUICK_REACTIONS: readonly string[] = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

/**
 * A Baasi handle: Latin letters, digits, dots and underscores, 3 to 30 characters, lower case, never
 * starting or ending with a dot. Latin only is what keeps a Cyrillic `а` from impersonating somebody.
 */
export const CHAT_HANDLE_PATTERN = /^(?!\.)(?!.*\.$)[a-z0-9._]{3,30}$/;

/**
 * The Socket.IO namespace of `chat-realtime`. `chat-api` emits into it through the Redis adapter, to
 * the room `t:<tenantId>:p:<userId>` of each person a frame is for, so no credential is needed to act
 * for the tenant a conversation belongs to.
 */
export const CHAT_REALTIME_NAMESPACE = '/chat';

/** What `chat-realtime` says to a socket. */
export const CHAT_SOCKET_EVENT = {
    READY: 'chat.ready',
    ERROR: 'chat.error',
    FRAME: 'chat.frame',
} as const;
