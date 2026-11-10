export enum SocialAppealStatus {
    PENDING = 'pending',
    /** The decision stands. */
    UPHELD = 'upheld',
    /** The decision was wrong, and what it did has been undone. */
    REVERSED = 'reversed',
}
