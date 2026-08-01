/**
 * The outcome of a signature check.
 *
 * **Not a boolean, and that is the entire point of the feature.** "Invalid" is the least useful
 * thing you can tell someone whose webhook is failing: the interesting cases are all the ways
 * verification could not even run. Six of these eight are "we did not check", each for a
 * different and separately fixable reason, and collapsing them into `false` is what makes
 * webhook debugging take an afternoon.
 *
 * Stored on every capture so the list view can be filtered by it, and returned by the
 * diagnostic alongside the evidence.
 *
 * A UI must not colour all six red. Only {@link SignatureVerdict.INVALID} and
 * {@link SignatureVerdict.TIMESTAMP_OUT_OF_TOLERANCE} indicate something wrong; the other five
 * "could not verify" verdicts mean nobody configured verification, and painting those as
 * failures sends people to debug a provider that is behaving correctly.
 */
export enum SignatureVerdict {
    /** Computed digest matched the received one, and any timestamp was inside tolerance. */
    VALID = 'valid',

    /**
     * Everything needed was present and the digests differ.
     *
     * The only verdict that suggests something is actually wrong — and even then, usually with
     * the secret or the manifest rather than with the request. The diagnostic's hints exist for
     * this case.
     */
    INVALID = 'invalid',

    /** The endpoint names no provider, so there is no manifest describing what to check. */
    NO_PROVIDER = 'no-provider',

    /** The manifest describes no signature scheme — this provider signs nothing. */
    NOT_SIGNED = 'not-signed',

    /** No signing secret is configured on the endpoint. Nothing to compute a digest with. */
    MISSING_SECRET = 'missing-secret',

    /** The manifest's header is absent from the request. Often the provider is not who you think. */
    MISSING_SIGNATURE = 'missing-signature',

    /**
     * The header is present but does not parse — a `key-value-list` without the expected key, or
     * a prefix that is not there. Distinct from `INVALID` because no digest was ever compared.
     */
    MALFORMED_SIGNATURE = 'malformed-signature',

    /**
     * Digest matched, but the signed timestamp is outside the provider's replay window.
     *
     * Separate from both `VALID` and `INVALID` on purpose: the signature is genuine, so this is
     * either a replay or a clock-skew problem, and those have opposite fixes.
     */
    TIMESTAMP_OUT_OF_TOLERANCE = 'timestamp-out-of-tolerance',
}
