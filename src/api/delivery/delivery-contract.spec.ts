import { describe, expect, it } from 'vitest';

import { DeliveryJobStatus } from './index.js';

describe('delivery contract', () => {
    it('keeps the job status wire values', () => {
        expect(Object.values(DeliveryJobStatus)).toEqual([
            'quoted',
            'dispatching',
            'courier-assigned',
            'picked-up',
            'in-transit',
            'delivered',
            'quote-expired',
            'expired',
            'failed',
            'cancelled',
        ]);
    });
});
