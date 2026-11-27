import { describe, expect, it } from 'vitest';

import { TaxiRefusal, TaxiRideStatus } from './index.js';

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

    it('keeps the refusal wire values clients translate', () => {
        expect(Object.values(TaxiRefusal).sort()).toEqual([
            'not-assigned-driver',
            'not-cancellable',
            'place-name-taken',
            'places-full',
            'quote-expired',
            'ride-moved-on',
            'schedule-window',
        ]);
    });
});
