/** What happened, for one line of a member's activity. */
export enum SocialActivityKind {
    POST_LIKED = 'post-liked',
    COMMENT_LIKED = 'comment-liked',
    POST_COMMENTED = 'post-commented',
    COMMENT_REPLIED = 'comment-replied',
    MENTIONED = 'mentioned',
    FOLLOWED = 'followed',
    FOLLOW_REQUESTED = 'follow-requested',
    FOLLOW_ACCEPTED = 'follow-accepted',
    /** Staff decided something about this member or what they posted. */
    MODERATION_NOTICE = 'moderation-notice',
}
