/** What a socket frame says. Identifiers only: a client refetches from `chat-api`, the one thing that knows what that reader may see. */
export enum ChatRealtimeEvent {
    CONVERSATION_UPDATED = 'chat.conversation.updated',
    CONVERSATION_TYPING = 'chat.conversation.typing',
    INBOX_UPDATED = 'chat.inbox.updated',
    /** A call rang, was answered or ended. The frame names the call and its conversation; the client fetches the call. */
    CALL_UPDATED = 'chat.call.updated',
}
