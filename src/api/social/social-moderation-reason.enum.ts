/** The rule a moderator says was broken. Shown to the member in their own language. */
export enum SocialModerationReason {
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
