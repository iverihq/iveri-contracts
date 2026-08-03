/**
 * What kind of principal an access token was minted for.
 *
 * It exists because `sub` alone cannot answer the question. A JWT's subject is *the principal*,
 * and identity issues tokens for two kinds of them: a person who logged in, and a service that
 * exchanged an API key. Both put a UUID in `sub`, and the two UUIDs mean entirely different
 * things — one names a row in `user`, the other a row in `api_key`.
 *
 * A consumer that reads `sub` as a user id without checking this claim attributes a machine's
 * actions to a user who does not exist. That is why every guard branches on it, and why it is
 * required rather than optional: `tsc` then makes the branch impossible to forget.
 */
export enum PrincipalType {
    /** A person, authenticated by password. `sub` is their `user.id`. */
    USER = 'user',

    /** A service, authenticated by API key. `sub` is the `api_key.id`, and there is no user. */
    SERVICE = 'service',
}
