import { describe, expect, it } from 'vitest';

import {
    ClinicAppointmentStatus,
    ClinicLeadKind,
    ClinicLeadStatus,
    ClinicPaymentMethod,
    ClinicRecordAccessAction,
    ClinicRecordMethod,
    ClinicResourceStatus,
} from './index.js';

describe('clinic contract', () => {
    it('keeps the resource status wire values', () => {
        expect(Object.values(ClinicResourceStatus)).toEqual(['active', 'inactive']);
    });

    it('keeps the lead wire values', () => {
        expect(Object.values(ClinicLeadKind)).toEqual(['callback', 'question']);
        expect(Object.values(ClinicLeadStatus)).toEqual(['new', 'handled']);
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

    it('keeps the payment method wire values', () => {
        expect(Object.values(ClinicPaymentMethod)).toEqual(['cash', 'card', 'transfer', 'course', 'bonus']);
    });

    it('keeps the clinical record wire values', () => {
        expect(Object.values(ClinicRecordMethod)).toEqual(['online', 'in-clinic']);
        expect(Object.values(ClinicRecordAccessAction)).toEqual(['visit', 'client']);
    });
});
