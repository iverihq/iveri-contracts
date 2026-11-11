/**
 * Where a consent flow stands.
 *
 * **A product learns the outcome here, not from the address it is sent back to.** The return
 * address carries the attempt id and a status, which are a hint for the page the person lands on;
 * the address bar is something anybody can type, so a product that acts on a connection reads the
 * attempt — or the connection — through the API first. The same rule as a payment return URL.
 */
export enum ConnectAttemptStatus {
    /** The consent page has been offered and nothing has come back yet. */
    PENDING = 'pending',

    /** The provider granted access and the tokens are stored on the connection. */
    CONNECTED = 'connected',

    /**
     * The person declined, the provider refused the code exchange, or the callback could not be
     * matched to what was asked. `failureReason` says which.
     */
    FAILED = 'failed',

    /**
     * Nothing came back before the attempt ran out.
     *
     * Not stored: an attempt still pending past its expiry is reported as this, because its state
     * and verifier can no longer be used and "pending" would suggest otherwise.
     */
    EXPIRED = 'expired',
}
