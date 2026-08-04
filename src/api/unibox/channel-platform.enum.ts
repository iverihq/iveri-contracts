/**
 * The messaging network a channel is connected to.
 *
 * This is Unibox's vocabulary, not Conduit's. Conduit knows about *connectors* — a set of hosts
 * and operations someone wrote down — and has no idea that any of them carry conversations.
 * Unibox knows that a WhatsApp message and an Instagram message are the same kind of thing and
 * belong in one inbox, which is the whole product.
 *
 * The members are the platforms Unibox can **normalize**, which is a stricter bar than the ones
 * Conduit can talk to: normalizing means we can read a provider's webhook into a contact, a
 * conversation and a message, and write a reply back. Adding one is a normalizer plus a
 * connector manifest, and is a minor version here.
 */
export enum ChannelPlatform {
    /** WhatsApp Cloud API. The first real platform, and the one `conduit-api` ships a manifest for. */
    WHATSAPP = 'whatsapp',

    /** Instagram Direct, via the Messenger Platform. */
    INSTAGRAM = 'instagram',

    /** Facebook Messenger. */
    MESSENGER = 'messenger',

    /**
     * A loopback platform for local development and tests, matching Conduit's `local-echo`
     * connector.
     *
     * It exists for the same reason that connector does: the entire pipeline — receive,
     * normalize, thread, reply, dispatch — is provable without a Meta app, and a real Meta app
     * would only prove we can talk to Meta. It is a first-class member rather than a test double
     * so the normalizer registry has no branch that only exists under Jest.
     */
    ECHO = 'echo',
}
