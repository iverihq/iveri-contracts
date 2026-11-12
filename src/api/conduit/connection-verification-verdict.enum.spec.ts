import { describe, expect, it } from 'vitest';

import { ConnectionVerificationVerdict } from './connection-verification-verdict.enum.js';
import { ConnectorAuthType } from './connector-auth-type.enum.js';

/**
 * Which verdict each auth type can reach.
 *
 * This is the contract's real content, and it lives here rather than in `conduit-api` because a
 * client has to map every verdict to a label, a tone and an explanation. A verdict no auth type
 * can produce is a label nobody will ever see; a verdict a client has not mapped renders unstyled
 * at the moment somebody is debugging a credential.
 */
const REACHABLE_BY: Readonly<Record<ConnectorAuthType, readonly ConnectionVerificationVerdict[]>> = {
    [ConnectorAuthType.NONE]: [ConnectionVerificationVerdict.NOTHING_TO_VERIFY],
    [ConnectorAuthType.API_KEY_HEADER]: [
        ConnectionVerificationVerdict.CREDENTIAL_PRESENT,
        ConnectionVerificationVerdict.MISCONFIGURED,
    ],
    [ConnectorAuthType.BEARER_STATIC]: [
        ConnectionVerificationVerdict.CREDENTIAL_PRESENT,
        ConnectionVerificationVerdict.MISCONFIGURED,
    ],
    [ConnectorAuthType.OAUTH2_CLIENT_CREDENTIALS]: [
        ConnectionVerificationVerdict.VERIFIED,
        ConnectionVerificationVerdict.VERIFIED_CACHED,
        ConnectionVerificationVerdict.INVALID_CREDENTIALS,
        ConnectionVerificationVerdict.MISCONFIGURED,
        ConnectionVerificationVerdict.PROVIDER_UNREACHABLE,
    ],
    [ConnectorAuthType.OAUTH2_REFRESH_TOKEN]: [
        ConnectionVerificationVerdict.VERIFIED,
        ConnectionVerificationVerdict.VERIFIED_CACHED,
        ConnectionVerificationVerdict.INVALID_CREDENTIALS,
        ConnectionVerificationVerdict.MISCONFIGURED,
        ConnectionVerificationVerdict.PROVIDER_UNREACHABLE,
    ],
    // `misconfigured` covers a connection nobody has connected yet: the token is only ever
    // granted, so its absence is a missing credential rather than a refused one. A long-lived
    // token with no refresh token reports `verified-cached`, because nothing was asked of the
    // provider.
    [ConnectorAuthType.OAUTH2_AUTHORIZATION_CODE]: [
        ConnectionVerificationVerdict.VERIFIED,
        ConnectionVerificationVerdict.VERIFIED_CACHED,
        ConnectionVerificationVerdict.INVALID_CREDENTIALS,
        ConnectionVerificationVerdict.MISCONFIGURED,
        ConnectionVerificationVerdict.PROVIDER_UNREACHABLE,
    ],
    // Verified as the service account itself, with no user named. That proves the key; whether the
    // company's admin granted delegation shows on the first dispatch that names a person.
    [ConnectorAuthType.OAUTH2_JWT_BEARER]: [
        ConnectionVerificationVerdict.VERIFIED,
        ConnectionVerificationVerdict.VERIFIED_CACHED,
        ConnectionVerificationVerdict.INVALID_CREDENTIALS,
        ConnectionVerificationVerdict.MISCONFIGURED,
        ConnectionVerificationVerdict.PROVIDER_UNREACHABLE,
    ],
    // A signing secret is checked by whoever receives the request, never by Conduit, so the most
    // that can be said here is that one is stored.
    [ConnectorAuthType.HMAC_SIGNATURE]: [
        ConnectionVerificationVerdict.CREDENTIAL_PRESENT,
        ConnectionVerificationVerdict.MISCONFIGURED,
    ],
};

describe('ConnectionVerificationVerdict', () => {
    it('has no two members sharing a wire value', () => {
        const values = Object.values(ConnectionVerificationVerdict);

        expect(new Set(values).size).toBe(values.length);
    });

    it('holds only verdicts some auth type can reach', () => {
        // The same rule `taxi-api` applies to its ride states: a member nothing can produce is a
        // state a client must still handle, and the handling is never exercised.
        const reachable = new Set(Object.values(REACHABLE_BY).flat());

        expect([...Object.values(ConnectionVerificationVerdict)].sort()).toEqual([...reachable].sort());
    });

    it('gives every auth type at least one verdict', () => {
        // `REACHABLE_BY` is keyed by the enum, so a new auth type fails to compile until somebody
        // decides what verifying it means — which is the decision worth forcing.
        for (const [authType, verdicts] of Object.entries(REACHABLE_BY)) {
            expect(verdicts.length).toBeGreaterThan(0);
            expect(authType).toBeTruthy();
        }
    });

    it('lets only an OAuth grant claim a credential was proven', () => {
        // `verified` means a provider confirmed the secret, which is only observable where a token
        // is exchanged. A static key reaching it would be a claim nothing checked.
        const proving = [ConnectionVerificationVerdict.VERIFIED, ConnectionVerificationVerdict.VERIFIED_CACHED];

        for (const [authType, verdicts] of Object.entries(REACHABLE_BY)) {
            const claimsProof = verdicts.some((verdict) => proving.includes(verdict));

            expect(claimsProof).toBe(authType.startsWith('oauth2-'));
        }
    });

    it('never lets a non-OAuth type reach a provider-side outcome', () => {
        // `invalid-credentials` and `provider-unreachable` both describe something a provider did.
        // Neither can happen where the check contacts nobody, and a client showing "provider
        // unreachable" for a static key would send somebody to check an outage that is not there.
        const providerSide = [
            ConnectionVerificationVerdict.INVALID_CREDENTIALS,
            ConnectionVerificationVerdict.PROVIDER_UNREACHABLE,
        ];

        for (const authType of [
            ConnectorAuthType.NONE,
            ConnectorAuthType.API_KEY_HEADER,
            ConnectorAuthType.BEARER_STATIC,
            ConnectorAuthType.HMAC_SIGNATURE,
        ]) {
            for (const verdict of providerSide) {
                expect(REACHABLE_BY[authType]).not.toContain(verdict);
            }
        }
    });
});
