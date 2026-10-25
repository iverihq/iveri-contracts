/**
 * The outcome of checking whether a connection's credentials still work.
 *
 * **Not a boolean, for the same reason {@link SignatureVerdict} is not.** The question an
 * operator asks after replacing a client secret is "did that work", and for three of the five
 * {@link ConnectorAuthType} members the honest answer is *we cannot tell from here* — each for a
 * different and separately fixable reason. Collapsing those into `false` would report a correctly
 * configured connection as broken; collapsing them into `true` would report an untested one as
 * proven.
 *
 * A UI must not colour all of these red. Only {@link ConnectionVerificationVerdict.INVALID_CREDENTIALS}
 * and {@link ConnectionVerificationVerdict.MISCONFIGURED} mean something is wrong;
 * {@link ConnectionVerificationVerdict.PROVIDER_UNREACHABLE} is somebody else's outage, and the
 * remaining three are "nothing to check" or "checked as far as this auth type allows".
 */
export enum ConnectionVerificationVerdict {
    /**
     * A token was minted just now, so the credentials are good as of this moment.
     *
     * Only an OAuth grant can reach this: it is the one case where the provider itself tells us
     * whether the secret is right, without us having to send a message somebody would receive.
     */
    VERIFIED = 'verified',

    /**
     * A cached access token is still usable, so nothing was asked of the provider.
     *
     * This is a weaker statement than {@link VERIFIED} and deliberately distinguished from it: it
     * says the credentials worked when the token was minted, not that they work now. A secret
     * revoked at the provider five minutes ago still reports this until the token expires.
     *
     * It exists so that clicking verify repeatedly does not spend a refresh token each time —
     * see the note on {@link ConnectorAuthType.OAUTH2_REFRESH_TOKEN} about rotation. Replacing a
     * connection's credentials discards the cached token, so the first verify after a credential
     * edit is never this.
     */
    VERIFIED_CACHED = 'verified-cached',

    /**
     * The credential the manifest asks for is present, and its correctness is unknowable from
     * here.
     *
     * A static secret is only ever checked by the provider when a real request carries it, so
     * this is as far as verification can go for {@link ConnectorAuthType.API_KEY_HEADER} and
     * {@link ConnectorAuthType.BEARER_STATIC}. That is not a cop-out: *presence* is exactly what
     * breaks after a credential edit — a cleared map, or a key renamed to something the manifest
     * does not ask for — and this catches it.
     */
    CREDENTIAL_PRESENT = 'credential-present',

    /** The connector adds no credential to a request, so there is nothing to check. */
    NOTHING_TO_VERIFY = 'nothing-to-verify',

    /**
     * The provider refused the credentials.
     *
     * The one verdict that means the secret itself is wrong. Everything needed was present and
     * the token endpoint said no.
     */
    INVALID_CREDENTIALS = 'invalid-credentials',

    /**
     * The credential, or the manifest field naming it, is missing.
     *
     * Distinct from {@link INVALID_CREDENTIALS} because the remedy is different and the provider
     * was never contacted: a connection with no `clientSecret`, or a manifest with an
     * `api-key-header` auth type and no `headerName`. The most common state immediately after a
     * credential map is cleared.
     */
    MISCONFIGURED = 'misconfigured',

    /**
     * The token endpoint could not be reached, or did not answer in time.
     *
     * Says nothing about the credentials. Worth its own verdict so an operator who has just
     * replaced a secret is not told it is wrong when the provider is simply down.
     */
    PROVIDER_UNREACHABLE = 'provider-unreachable',
}
