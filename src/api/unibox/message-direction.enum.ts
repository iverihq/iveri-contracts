/**
 * Which way a message travelled.
 *
 * Separate from {@link MessageAuthorType} on purpose, because they answer different questions and
 * the mapping is not one-to-one. A `SYSTEM` note ("conversation assigned to Dana") is outbound in
 * neither sense — it was never sent anywhere — so it is `INTERNAL`, and collapsing the two fields
 * would make every internal note look like something a customer received.
 */
export enum MessageDirection {
    /** From the contact to us, through a provider. */
    INBOUND = 'inbound',

    /** From us to the contact, through Conduit. */
    OUTBOUND = 'outbound',

    /**
     * Never left Unibox. Assignment notes, status changes, private agent comments.
     *
     * Rendered in the thread because context is what makes a handover work, but structurally
     * distinct: an internal message has no delivery status and no provider message id, and a bug
     * that sent one would be a customer reading our internal notes.
     */
    INTERNAL = 'internal',
}
