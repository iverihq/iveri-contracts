/**
 * Why a member reported something.
 *
 * `child-safety` is the one that changes what happens: the content is hidden at once and the case
 * goes to the top of the queue, before anybody has looked at it.
 */
export enum SocialReportReason {
    SPAM = 'spam',
    HARASSMENT = 'harassment',
    HATE = 'hate',
    VIOLENCE = 'violence',
    NUDITY = 'nudity',
    CHILD_SAFETY = 'child-safety',
    SELF_HARM = 'self-harm',
    IMPERSONATION = 'impersonation',
    ILLEGAL = 'illegal',
    OTHER = 'other',
}
