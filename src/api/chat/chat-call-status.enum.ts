/** Where a call is. Only `ended` is final, and only an ended call has an end reason. */
export enum ChatCallStatus {
    RINGING = 'ringing',
    ACTIVE = 'active',
    ENDED = 'ended',
}
