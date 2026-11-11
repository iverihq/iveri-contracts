/** The `typ` claim of a socket ticket. A token without it is never read as a ticket. */
export const CHAT_SOCKET_TICKET_TYPE = 'chat-socket';

/** What an app's secret looks like: this prefix, then 32 random bytes in base64url. */
export const CHAT_APP_SECRET_PREFIX = 'bs_';

/** At most this many secrets of one app work at once, so a rotation never needs an outage and never piles up. */
export const CHAT_APP_MAX_ACTIVE_SECRETS = 2;

/** The longest an app's token may live, from `iat` to `exp`. */
export const CHAT_APP_TOKEN_MAX_TTL_SECONDS = 86_400;

/** A minted token's lifetime when the server does not say. */
export const CHAT_APP_TOKEN_DEFAULT_TTL_SECONDS = 3_600;

/** The longest id an app may give one of its users. */
export const CHAT_EXTERNAL_USER_ID_MAX_LENGTH = 255;
