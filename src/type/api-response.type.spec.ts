import { ErrorCode } from '../enum/error-code.enum.js';

import type { ApiResponse } from './api-response.type.js';

/**
 * Compile-time assertion helper. `Expect<Equal<A, B>>` is a type error unless A and B are
 * identical, so a change that widens or breaks a contract type fails `tsc`, not a test run.
 */
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

interface Tenant {
    id: string;
    name: string;
}

describe('ApiResponse', () => {
    it('narrows to the payload when success is true', () => {
        const response: ApiResponse<Tenant> = {
            success: true,
            data: { id: 'a3f1c2d4-0000-4000-8000-000000000001', name: 'Acme' },
        };

        if (!response.success) {
            throw new Error('expected the success branch');
        }

        // Narrowed: `data` is reachable and `error` is not on this branch.
        type SuccessBranch = Expect<Equal<typeof response.data, Tenant>>;
        const narrowed: SuccessBranch = true;

        expect(narrowed).toBe(true);
        expect(response.data.name).toBe('Acme');
    });

    it('narrows to the error envelope when success is false', () => {
        const response: ApiResponse<Tenant> = {
            success: false,
            error: {
                code: ErrorCode.RESOURCE_NOT_FOUND,
                message: 'Tenant not found',
                correlationId: 'f0e1d2c3-0000-4000-8000-000000000002',
            },
            timestamp: '2026-07-31T10:00:00.000Z',
            path: '/tenant/unknown',
        };

        if (response.success) {
            throw new Error('expected the error branch');
        }

        expect(response.error.code).toBe(ErrorCode.RESOURCE_NOT_FOUND);
        expect(response.error.details).toBeUndefined();
    });
});
