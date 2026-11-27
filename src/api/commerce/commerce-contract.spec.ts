import { describe, expect, it } from 'vitest';

import { CommerceRefusal } from './index.js';

describe('commerce contract', () => {
    it('keeps the refusal reasons a client translates', () => {
        expect(Object.values(CommerceRefusal)).toEqual([
            'out-of-stock',
            'not-for-sale',
            'mixed-currency',
            'not-awaiting-payment',
            'not-cancellable',
            'saved-full',
            'slug-taken',
            'sku-taken',
            'variant-options-taken',
            'last-variant',
            'stock-below-reserved',
            'image-limit',
            'order-not-confirmed',
            'fulfillment-exists',
            'not-packed',
            'couriers-off',
        ]);
    });
});
