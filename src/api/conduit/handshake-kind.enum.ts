/**
 * How a provider proves the endpoint is really ours before it will send anything.
 *
 * **Handshakes work in inspect mode, deliberately.** Meta will not save a callback URL that
 * does not echo `hub.challenge`, and Slack will not save one that does not echo `challenge` —
 * so without this, the local developer tool could never be registered with the provider at all,
 * and there would be nothing to capture. It is the one piece of ingress behaviour that is not
 * "store and acknowledge".
 */
export enum HandshakeKind {
    /**
     * Provider sends `GET ?mode=subscribe&verify_token=…&challenge=…` and expects the challenge
     * echoed back as the plain-text body. Meta (WhatsApp, Messenger, Instagram).
     */
    QUERY_ECHO = 'query-echo',

    /**
     * Provider sends a JSON body carrying a trigger field and a challenge, and expects the
     * challenge echoed in a JSON response. Slack (`type: url_verification`).
     */
    JSON_ECHO = 'json-echo',
}
