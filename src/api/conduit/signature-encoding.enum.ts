/**
 * How the computed digest is rendered before comparison.
 *
 * Getting this wrong is one of the two most common causes of a webhook signature that "should
 * work but doesn't" — the digest is right and the string is not. Naming it in the manifest is
 * what lets the diagnostic show the caller both encodings of the same digest rather than a bare
 * "mismatch".
 */
export enum SignatureEncoding {
    HEX = 'hex',
    BASE64 = 'base64',
}
