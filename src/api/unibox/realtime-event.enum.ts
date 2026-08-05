/**
 * What happened to a conversation, as told to a live subscriber.
 *
 * Deliberately a small closed set rather than a free-form string. A subscriber decides what to
 * refetch from the event name, so an unrecognised one means either doing nothing — a live inbox
 * that silently stops updating — or refetching everything, which is a stampede triggered by
 * whatever a publisher felt like sending.
 *
 * **These are notifications, not state.** The payload carries identifiers, never the message
 * body or the contact's details: an event is a prompt to read from `unibox-api`, which is the
 * only thing that can answer for what the reader is allowed to see. That also keeps a missed
 * event harmless — the next read is correct regardless.
 */
export enum RealtimeConversationEvent {
    /** A message was appended. The reader refetches the conversation's messages. */
    MESSAGE_CREATED = 'message.created',
    /** A message's delivery status moved — sent, delivered, read, failed. */
    MESSAGE_STATUS_CHANGED = 'message.status-changed',
    /** Status, unread count, or another conversation-level field changed. */
    CONVERSATION_UPDATED = 'conversation.updated',
    /** The conversation moved to another agent or team, or a human took over from the AI. */
    CONVERSATION_ASSIGNED = 'conversation.assigned',
}
