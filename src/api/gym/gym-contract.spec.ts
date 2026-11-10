import { describe, expect, it } from 'vitest';

import {
    GymBookingRefusal,
    GymBookingStatus,
    GymCheckInOutcome,
    GymCheckInRefusal,
    GymClassAccess,
    GymEntryKind,
    GymMembershipStatus,
    GymPaymentMethod,
    GymResourceStatus,
    GymSessionKind,
} from './index.js';

describe('gym contract', () => {
    it('keeps the resource status wire values', () => {
        expect(Object.values(GymResourceStatus).sort()).toEqual(['active', 'inactive']);
    });

    it('keeps one plan shape of entry, classes and sessions', () => {
        expect(Object.values(GymEntryKind).sort()).toEqual(['none', 'unlimited', 'visits']);
        expect(Object.values(GymClassAccess).sort()).toEqual(['credits', 'none', 'unlimited']);
    });

    it('keeps the membership statuses', () => {
        expect(Object.values(GymMembershipStatus).sort()).toEqual([
            'active',
            'awaiting-payment',
            'cancelled',
            'expired',
            'frozen',
            'upcoming',
        ]);
    });

    it('keeps the reasons the door can give', () => {
        expect(Object.values(GymCheckInOutcome).sort()).toEqual(['admitted', 'overridden', 'refused']);
        expect(Object.values(GymCheckInRefusal).sort()).toEqual([
            'awaiting-payment',
            'expired',
            'frozen',
            'invalid-code',
            'no-membership',
            'no-visits-left',
            'not-started',
            'outside-hours',
            'wrong-branch',
        ]);
    });

    it('keeps the booking statuses and refusals clients translate', () => {
        expect(Object.values(GymBookingStatus).sort()).toEqual([
            'attended',
            'cancelled',
            'confirmed',
            'late-cancelled',
            'no-show',
            'waitlisted',
        ]);
        expect(Object.values(GymBookingRefusal)).toHaveLength(11);
    });

    it('keeps a class and a personal session in one table', () => {
        expect(Object.values(GymSessionKind).sort()).toEqual(['class', 'personal']);
    });

    it('keeps the ways of paying', () => {
        expect(Object.values(GymPaymentMethod).sort()).toEqual(['card', 'cash', 'online', 'transfer']);
    });
});
