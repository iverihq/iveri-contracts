import { describe, expect, it } from 'vitest';

import { IveriProduct, LicenceKind, LicenceStatus } from './index.js';

describe('platform contract', () => {
    it('keeps the product, licence kind and licence status wire values', () => {
        expect(Object.values(IveriProduct)).toEqual([
            'hr',
            'clinic',
            'commerce',
            'restaurant',
            'gym',
            'taxi',
            'delivery',
            'unibox',
            'conduit',
            'chat',
        ]);
        expect(Object.values(LicenceKind)).toEqual(['trial', 'paid']);
        expect(Object.values(LicenceStatus)).toEqual(['scheduled', 'active', 'expired', 'cancelled']);
    });
});
