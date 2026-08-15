/**
 * A way a notification reaches a person.
 *
 * A channel is not a provider. `EMAIL` says a message is addressed to a mailbox; whether it
 * leaves through a local SMTP sink, SES or a transactional-email vendor is an adapter detail
 * `iveri-notification-api` keeps behind its own boundary, and nothing on the wire names one.
 *
 * **There is deliberately no `PUSH` member yet**, and adding one is not a formality. Push needs a
 * device registry, per-platform credentials (APNs keys, FCM service accounts) and a token-rotation
 * story, none of which exist and none of which any product currently asks for. A member declared
 * before the machinery behind it is a value a caller can send that quietly goes nowhere — worse
 * than a 422 saying the channel is unknown, because it looks like it worked.
 */
export enum NotificationChannel {
    /** A message to a mailbox. Needs `recipient.emailAddress`. */
    EMAIL = 'email',

    /**
     * A row in the recipient's own in-app inbox. Needs `recipient.userId`.
     *
     * The only channel whose delivery is a local write, which is why it is the one channel that
     * cannot fail for a reason outside our control. It still goes through the same queue as
     * email: a notification that fans out to both must not have one half committed inline and the
     * other half queued, or a rollback leaves the two halves disagreeing about what happened.
     */
    IN_APP = 'in-app',
}
