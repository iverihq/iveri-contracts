import { ErrorCode } from './error-code.enum.js';

describe('ErrorCode', () => {
    it('gives every member a wire value identical to its key', () => {
        // The value is what ships in the JSON body. Keeping it identical to the key means a
        // support ticket quoting "TENANT_MISMATCH" greps straight to the member, and a rename
        // can never silently change the contract while the code still compiles.
        for (const [key, value] of Object.entries(ErrorCode)) {
            expect(value).toBe(key);
        }
    });

    it('has no two members sharing a wire value', () => {
        const values = Object.values(ErrorCode);

        expect(new Set(values).size).toBe(values.length);
    });

    it('uses SCREAMING_SNAKE_CASE for every member', () => {
        for (const key of Object.keys(ErrorCode)) {
            expect(key).toMatch(/^[A-Z][A-Z0-9_]*$/);
        }
    });
});
