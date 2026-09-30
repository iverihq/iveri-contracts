/** Closed worker-response lifecycle for one dispatch candidate offer. */
export enum MobilityDispatchOfferStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    EXPIRED = 'expired',
    SUPERSEDED = 'superseded',
}
