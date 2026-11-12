import { describe, expect, it } from 'vitest';

import { TaxiRideStatus } from './index.js';

describe('taxi contract', () => {
    it('keeps the ride status wire values', () => {
        expect(Object.values(TaxiRideStatus)).toEqual([
            'quoted',
            'dispatching',
            'driver-assigned',
            'driver-arriving',
            'in-progress',
            'completed',
            'cancelled',
            'expired',
        ]);
    });
});
