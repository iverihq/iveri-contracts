/** One direction of the follow graph, as one member sees it. */
export enum SocialFollowState {
    NONE = 'none',
    /** Waiting for a private account to answer. */
    REQUESTED = 'requested',
    FOLLOWING = 'following',
}
