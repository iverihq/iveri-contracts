import { ALL_USER_PERMISSIONS, UserPermission } from './user-permission.enum.js';

describe('UserPermission', () => {
    it('has no two members sharing a wire value', () => {
        // A duplicate value would make two members indistinguishable in a token payload, so a
        // role granting one would silently grant the other.
        const values = Object.values(UserPermission);

        expect(new Set(values).size).toBe(values.length);
    });

    it('uses SCREAMING_SNAKE_CASE for every member', () => {
        for (const key of Object.keys(UserPermission)) {
            expect(key).toMatch(/^[A-Z][A-Z0-9_]*$/);
        }
    });

    it('formats every value as lowercase colon-separated segments', () => {
        // The shape is what makes a wildcard match (`role:*`) possible later and keeps a token
        // payload readable in a log line.
        for (const value of Object.values(UserPermission)) {
            expect(value).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*(:[a-z0-9]+(-[a-z0-9]+)*)+$/);
        }
    });

    it('exposes every member through ALL_USER_PERMISSIONS', () => {
        // Identity validates custom-role input against this list. A member missing from it is
        // a permission nobody can be granted.
        expect([...ALL_USER_PERMISSIONS].sort()).toEqual(Object.values(UserPermission).sort());
    });

    it('freezes ALL_USER_PERMISSIONS', () => {
        // Shared mutable state in a browser bundle otherwise: one caller sorting it in place
        // reorders it for every other consumer in the same process.
        expect(Object.isFrozen(ALL_USER_PERMISSIONS)).toBe(true);
    });

    it.each([
        ['CONDUIT_', 'conduit:'],
        ['COMMERCE_', 'commerce:'],
        ['UNIBOX_', 'unibox:'],
    ])('namespaces every %s permission as %s', (keyPrefix, valuePrefix) => {
        // Identity's members predate the shared catalogue and are embedded in issued tokens
        // and stored role rows — prefixing them now would invalidate both. Every service added
        // since is namespaced, so two services can each own a `contact` or an `endpoint`
        // without one of them having to rename a permission that is already in issued tokens.
        const namespaced = Object.entries(UserPermission).filter(([key]) => key.startsWith(keyPrefix));

        expect(namespaced.length).toBeGreaterThan(0);

        for (const [, value] of namespaced) {
            expect(value.startsWith(valuePrefix)).toBe(true);
        }
    });
});
