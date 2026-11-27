import { describe, expect, it } from 'vitest';

import { DeliveryJobStatus, DeliveryRefusal } from './index.js';

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

    it('keeps the refusal wire values clients translate', () => {
        expect(Object.values(DeliveryRefusal).sort()).toEqual([
            'job-moved-on',
            'not-assigned-courier',
            'not-cancellable',
            'photo-format',
            'photo-limit',
            'photo-retry',
            'photo-too-large',
            'photo-unreadable',
            'quote-expired',
        ]);
    });
});
