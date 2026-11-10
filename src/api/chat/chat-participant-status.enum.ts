/** Where somebody stands in a conversation. `request` waits for them to accept it, and the sender cannot see whether it was read until they do. */
export enum ChatParticipantStatus {
    ACTIVE = 'active',
    REQUEST = 'request',
    LEFT = 'left',
    REMOVED = 'removed',
}
