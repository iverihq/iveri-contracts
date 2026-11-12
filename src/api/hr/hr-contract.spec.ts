import { describe, expect, it } from 'vitest';

import { UserPermission } from '../../enum/index.js';

import { HrEmploymentStatus, HrLeaveLedgerKind, HrLeaveRequestStatus, HrWorkPlace } from './index.js';

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

    it('keeps the work place wire values', () => {
        expect(Object.values(HrWorkPlace)).toEqual(['office', 'home']);
    });

    it('keeps pay apart from the employee record', () => {
        expect(UserPermission.HR_COMPENSATION_READ).not.toBe(UserPermission.HR_EMPLOYEE_READ);
    });

    it('keeps preparing a payroll apart from approving it', () => {
        expect(UserPermission.HR_PAYROLL_APPROVE).not.toBe(UserPermission.HR_PAYROLL_MANAGE);
    });
});
