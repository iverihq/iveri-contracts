import { describe, expect, it } from 'vitest';

import { UserPermission } from '../../enum/index.js';

import {
    HrApplicationSource,
    HrEmploymentStatus,
    HrLeaveLedgerKind,
    HrLeaveRequestStatus,
    HrReferralOutcome,
    HrRefusal,
    HrWorkPlace,
} from './index.js';

describe('hr contract', () => {
    it('keeps the employment status wire values', () => {
        expect(Object.values(HrEmploymentStatus)).toEqual(['upcoming', 'active', 'leaving', 'former']);
    });

    it('keeps the leave wire values', () => {
        expect(Object.values(HrLeaveRequestStatus)).toEqual(['pending', 'approved', 'rejected', 'cancelled']);
        expect(Object.values(HrLeaveLedgerKind)).toEqual([
            'allowance',
            'accrual',
            'carry-over',
            'adjustment',
            'taken',
            'returned',
        ]);
    });

    it('keeps the refusals clients translate, each value once and in kebab case', () => {
        const values = Object.values(HrRefusal);

        expect(new Set(values).size).toBe(values.length);
        expect(values.every((value) => /^[a-z]+(-[a-z]+)*$/.test(value))).toBe(true);
        expect(HrRefusal.LICENCE_SEATS).toBe('licence-seats');
        expect(HrRefusal.TIME_OFF_OVERLAP).toBe('time-off-overlap');
    });

    it('keeps the work place wire values', () => {
        expect(Object.values(HrWorkPlace)).toEqual(['office', 'home']);
    });

    it('keeps the application source and referral outcome wire values', () => {
        expect(Object.values(HrApplicationSource)).toEqual(['careers', 'added', 'referral']);
        expect(Object.values(HrReferralOutcome)).toEqual(['in-progress', 'hired', 'closed']);
    });

    it('keeps pay apart from the employee record', () => {
        expect(UserPermission.HR_COMPENSATION_READ).not.toBe(UserPermission.HR_EMPLOYEE_READ);
    });

    it('keeps preparing a payroll apart from approving it', () => {
        expect(UserPermission.HR_PAYROLL_APPROVE).not.toBe(UserPermission.HR_PAYROLL_MANAGE);
    });
});
