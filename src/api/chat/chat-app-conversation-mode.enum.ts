/** Who may start a conversation inside an outside app. */
export enum ChatAppConversationMode {
    /** Only the app's server, through `PUT /server/conversations`. Its users use what it opened. */
    SERVER = 'server',
    /** Its users too, naming each other by the app's own ids. There is no search and no contact list. */
    USERS = 'users',
}
