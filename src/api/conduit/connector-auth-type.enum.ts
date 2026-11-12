/**
 * How a connector proves who we are to the third-party API it fronts.
 *
 * This is the field that decides whether Conduit has to hold a *renewable* credential or merely
 * a static one, and the two are very different operationally: a static key works until someone
 * rotates it, an OAuth token stops working on a schedule and something has to notice first.
 *
 * The list is deliberately short. Every member is a scheme a manifest can describe entirely as
 * data — adding a provider that uses one of these is a manifest and a credential, never a code
 * change, which is the whole promise of §11's connector manifest. A provider needing anything
 * else (a request-signing scheme, mutual TLS) does not get a special case bolted on here; it
 * gets a new member, designed once, with the same "no per-provider branches" rule applied to it.
 */
export enum ConnectorAuthType {
    /** The API is open, or the credential travels in the payload. Nothing is added to a request. */
    NONE = 'none',

    /**
     * A static secret sent in a header — `X-Api-Key: …`, `Authorization: Basic …`.
     *
     * The header name and any literal prefix come from the manifest; only the secret comes from
     * the connection. That split is what lets one manifest serve every tenant.
     */
    API_KEY_HEADER = 'api-key-header',

    /** A static bearer token. Shorthand for {@link API_KEY_HEADER} with the header and prefix fixed. */
    BEARER_STATIC = 'bearer-static',

    /**
     * OAuth 2.0 client credentials (RFC 6749 §4.4): exchange a client id and secret for a
     * short-lived access token, and do it again when it expires. Machine-to-machine, no user.
     */
    OAUTH2_CLIENT_CREDENTIALS = 'oauth2-client-credentials',

    /**
     * OAuth 2.0 refresh token (RFC 6749 §6): a long-lived refresh token buys short-lived access
     * tokens.
     *
     * **The refresh token may be rotated by the provider on every use**, and Conduit stores
     * whichever one came back last. That single fact is why refreshing has to be serialised
     * across replicas rather than left to race — two simultaneous refreshes rotate twice, one
     * of the two results is stored, and the connection is dead until a human re-authorises it.
     */
    OAUTH2_REFRESH_TOKEN = 'oauth2-refresh-token',

    /**
     * OAuth 2.0 authorization code with PKCE (RFC 6749 §4.1, RFC 7636): a person grants access on
     * the provider's own consent page, and the provider hands the tokens back to Conduit.
     *
     * **Nobody types this credential in.** The connection holds the app's client id and secret;
     * the access token, and a refresh token when the provider issues one, arrive at Conduit's
     * callback and are stored encrypted on the connection. That is the only way to obtain a
     * token a provider gives out per installation — Slack's bot token, a person's own Slack token
     * — because only somebody signed in at the provider can grant it.
     *
     * Afterwards it behaves like {@link OAUTH2_REFRESH_TOKEN}: a token with a lifetime is renewed
     * with the refresh token under the same row lock. A token issued with **no lifetime and no
     * refresh token** — Slack's, unless the app turns on rotation — is long-lived and is used until
     * the provider refuses it; assuming an hour would leave it unusable with nothing to renew it.
     *
     * The PKCE verifier and the `state` stay on the server, are single-use and expire in minutes,
     * so a consent page reached twice, or a callback replayed, connects nothing.
     */
    OAUTH2_AUTHORIZATION_CODE = 'oauth2-authorization-code',

    /**
     * OAuth 2.0 JWT bearer grant (RFC 7523 §2.1): a service account signs an assertion with its own
     * private key and exchanges it for a short-lived access token, **optionally acting as a named
     * user**.
     *
     * This is Google Workspace's domain-wide delegation: the company's admin trusts one service
     * account once, and Conduit then writes into each employee's own calendar by naming them as
     * the assertion's `sub`. One credential, one consent, every person — nobody connects their own
     * account and nobody can forget to.
     *
     * The user is named **per dispatch**, through the variable the manifest's `subjectVariable`
     * names, so one connection serves a whole company. Tokens are cached per connection *and*
     * subject: a token minted to act as one person must never be sent on behalf of another. No
     * refresh token exists — the key signs a fresh assertion whenever one is needed — so, unlike
     * {@link OAUTH2_REFRESH_TOKEN}, two replicas minting at once costs a token, not a connection.
     */
    OAUTH2_JWT_BEARER = 'oauth2-jwt-bearer',

    /**
     * Every request is **signed** with a shared secret, and nothing is sent as a credential.
     *
     * The receiver holds the same secret and recomputes the signature over the bytes it received,
     * so a request that was altered, or forged by somebody without the secret, fails its check.
     * This is how a webhook is authenticated to whoever receives it: Baasi's webhooks to a
     * customer's server are dispatches on a connector of this type.
     *
     * The connection's `secret` credential is the key ({@link CONNECTOR_CREDENTIAL_SECRET}), and
     * the manifest's `signature` names the header and the format. **The signature covers the exact
     * bytes sent and a timestamp of that attempt**, so a retried attempt carries a fresh signature,
     * and a receiver that refuses old timestamps refuses a replayed request.
     */
    HMAC_SIGNATURE = 'hmac-signature',
}
