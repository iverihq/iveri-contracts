/**
 * Hash backing a provider's HMAC.
 *
 * `SHA1` is here because Meta still sends `x-hub-signature` alongside the SHA-256 header and
 * some older integrations only have that one. It is **not** a recommendation — a manifest using
 * it is verifying what the provider actually sends, which is the only useful thing a diagnostic
 * can do. Nothing in Conduit ever *chooses* SHA-1.
 *
 * Values are the strings `node:crypto` expects, so no lookup table stands between the manifest
 * and `createHmac` — one fewer place for a typo to become "signature mismatch".
 */
export enum SignatureAlgorithm {
    SHA1 = 'sha1',
    SHA256 = 'sha256',
    SHA512 = 'sha512',
}
