import { PrincipalType } from './principal-type.enum.js';

describe('PrincipalType', () => {
    it('keeps the wire values that are already baked into issued tokens', () => {
        // These strings are inside signed JWTs, so they cannot be renamed the way an internal
        // enum can — every token minted before the change would decode to an unknown kind and
        // fall through whatever branch handles "not a service". Pinned deliberately.
        expect(PrincipalType.USER).toBe('user');
        expect(PrincipalType.SERVICE).toBe('service');
    });

    it('has no two members sharing a wire value', () => {
        const values = Object.values(PrincipalType);

        expect(new Set(values).size).toBe(values.length);
    });
});
