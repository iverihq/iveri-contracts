/** Where a client's review stands. Nothing reaches the public until somebody has read it. */
export enum ClinicReviewStatus {
    PENDING = 'pending',
    PUBLISHED = 'published',
    HIDDEN = 'hidden',
}
