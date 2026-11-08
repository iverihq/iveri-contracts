import { describe, expect, it } from 'vitest';

import { ClinicAppointmentStatus, ClinicResourceStatus } from './index.js';

describe('clinic contract', () => {
    it('keeps the resource status wire values', () => {
        expect(Object.values(ClinicResourceStatus)).toEqual(['active', 'inactive']);
    });

    it('keeps the appointment status wire values', () => {
        expect(Object.values(ClinicAppointmentStatus)).toEqual([
            'booked',
            'checked-in',
            'completed',
            'cancelled',
            'no-show',
        ]);
    });
});
