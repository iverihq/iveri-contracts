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
}
