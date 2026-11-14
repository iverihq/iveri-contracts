/** How a call ended. Each is a different sentence in the conversation afterwards. */
export enum ChatCallEndReason {
    /** Somebody answered, and then somebody hung up. */
    COMPLETED = 'completed',
    /** Nobody answered before the ringing stopped. */
    MISSED = 'missed',
    /** The person called said no. */
    DECLINED = 'declined',
    /** The caller hung up before anybody answered. */
    CANCELLED = 'cancelled',
    /** The person called was already in another call. */
    BUSY = 'busy',
    /** It was answered and nobody reached the call server, which is a network fault, not a person's choice. */
    FAILED = 'failed',
}
