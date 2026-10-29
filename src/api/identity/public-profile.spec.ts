import type { Principal, PublicProfile } from './auth.type.js';

/**
 * What a person may see about somebody else.
 *
 * `PublicProfile` is a deliberately narrow projection of the same row `Principal` describes, and
 * **its value is entirely in what it omits**: a passenger looking at the driver coming to collect
 * them gets a name and a face, and nothing that would turn `GET /users/:userId/profile` into a
 * way to enumerate a tenant's staff, their addresses or their roles.
 *
 * A type cannot be read at runtime, so this asserts it the only way a type can be asserted — by
 * writing down the key set and letting `tsc` refuse the object if the interface disagrees. A
 * field added to `PublicProfile` fails the first assertion; a field removed from `Principal`
 * fails the second. Neither is something a reviewer reliably notices in a diff.
 */
describe('PublicProfile', () => {
    const profile: PublicProfile = {
        userId: '00000000-0000-4000-8000-000000000000',
        displayName: 'Nino Beridze',
        avatarUrl: null,
    };

    it('carries exactly three fields', () => {
        expect(Object.keys(profile).sort()).toEqual(['avatarUrl', 'displayName', 'userId']);
    });

    it('carries nothing that identifies or contacts the person beyond their name', () => {
        // Spelled out rather than derived from `Principal`, because the point is the list: each
        // of these is a field somebody will one day have a reason to add here, and each is a
        // reason to say no. An email and a phone are contact details the subject did not offer
        // to this reader; a role, a membership and a tenant are the shape of an organisation.
        const forbidden = [
            'email',
            'phone',
            'firstName',
            'lastName',
            'tenantId',
            'tenantName',
            'tenantSlug',
            'tenantStatus',
            'membershipStatus',
            'roleSlugs',
            'permissions',
        ] as const;

        for (const field of forbidden) {
            expect(profile).not.toHaveProperty(field);
        }
    });

    it('leaves a name the server composed, never two halves for a client to join', () => {
        // Each client assembling `${firstName} ${lastName}` is how one driver comes to be
        // "Nino Beridze" on a phone, "Beridze Nino" in a panel and "Nino" on a receipt — and it
        // puts a name's word order, which is not the same everywhere, into six codebases.
        const composed: keyof PublicProfile = 'displayName';
        expect(profile[composed]).toBe('Nino Beridze');
    });
});

/** The private half, for contrast: this one does carry contact details, to their owner only. */
describe('Principal', () => {
    it('gained a phone and a photo without either becoming required', () => {
        // Nullable rather than optional: an API-key principal has no person behind it, and every
        // client already branches on that for `email` and `firstName`. An optional field would
        // have added a second shape of absence to the same object.
        const machine: Pick<Principal, 'email' | 'firstName' | 'lastName' | 'phone' | 'avatarUrl'> = {
            email: null,
            firstName: null,
            lastName: null,
            phone: null,
            avatarUrl: null,
        };

        expect(Object.values(machine).every((value) => value === null)).toBe(true);
    });
});
