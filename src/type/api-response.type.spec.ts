import { ErrorCode } from '../enum/error-code.enum.js';

import type { ApiErrorResponse } from './api-response.type.js';

describe('ApiErrorResponse', () => {
    it('carries the code, the correlation id and the path', () => {
        const response: ApiErrorResponse = {
            success: false,
            error: {
                code: ErrorCode.RESOURCE_NOT_FOUND,
                message: 'Tenant not found',
                correlationId: 'f0e1d2c3-0000-4000-8000-000000000002',
            },
            timestamp: '2026-07-31T10:00:00.000Z',
            path: '/tenant/unknown',
        };

        expect(response.error.code).toBe(ErrorCode.RESOURCE_NOT_FOUND);
        expect(response.error.details).toBeUndefined();
    });
});
