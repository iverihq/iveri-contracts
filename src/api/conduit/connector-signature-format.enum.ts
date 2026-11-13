/**
 * How an `HMAC_SIGNATURE` connector writes the signature header.
 *
 * One format today. A receiver has to implement whichever format it is sent, so each member is a
 * documented, stable wire format rather than a knob.
 */
export enum ConnectorSignatureFormat {
    /**
     * `t=<unix seconds>,v1=<signature>`, where the signature is the lowercase hex HMAC-SHA256 of
     * `<t>.<raw body bytes>` keyed by the connection's secret.
     *
     * Stripe's webhook scheme, chosen because receivers already know how to verify it: split the
     * header on commas, recompute over the timestamp, a dot and the body exactly as received,
     * compare in constant time, and refuse a timestamp older than a few minutes. A request with no
     * body is signed over `<t>.` alone.
     *
     * While a replaced secret is still within its overlap the header carries one `v1=` per live
     * secret, the newest first (`t=…,v1=<new>,v1=<old>`), which is how Stripe signs during a roll:
     * a receiver accepts the request when any `v1` matches the secret it holds.
     */
    STRIPE_V1 = 'stripe-v1',
}
