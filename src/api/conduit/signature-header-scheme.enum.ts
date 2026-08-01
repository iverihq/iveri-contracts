/**
 * How the signature is packed into its header.
 *
 * Two shapes cover every provider we have met:
 *
 * - `DIRECT` — the header *is* the signature, optionally behind a prefix:
 *   `x-hub-signature-256: sha256=a1b2…`
 * - `KEY_VALUE_LIST` — a comma-separated list the signature is one entry of, because the
 *   provider also ships a timestamp in the same header:
 *   `stripe-signature: t=1737031234,v1=a1b2…`
 *
 * Modelling the packing separately from the digest is what keeps "add TikTok" a manifest rather
 * than a code change.
 */
export enum SignatureHeaderScheme {
    DIRECT = 'direct',
    KEY_VALUE_LIST = 'key-value-list',
}
