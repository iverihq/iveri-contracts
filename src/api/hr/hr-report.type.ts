import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { LocalizedText } from './localized-text.type.js';

export interface HrAbsenceMonth {
    month: string;
    /** Everybody's working half-days while they worked here, public holidays out. */
    workingHalfDays: number;
    /** Sick and unpaid working half-days. */
    absentHalfDays: number;
    absenceRatePercent: Nullable<number>;
}

export interface HrAbsenceReport {
    from: string;
    to: string;
    workingHalfDays: number;
    absentHalfDays: number;
    absenceRatePercent: Nullable<number>;
    months: HrAbsenceMonth[];
}

export interface HrHeadcountMonth {
    month: string;
    /** On the month's last day, or today for this month. */
    headcount: number;
    joiners: number;
    leavers: number;
    /** Leavers over the average of the headcount at the month's start and end. */
    turnoverPercent: Nullable<number>;
}

export interface HrHeadcountReport {
    from: string;
    to: string;
    /** Today. */
    headcount: number;
    joiners: number;
    leavers: number;
    /** Leavers over the twelve months, over the average monthly headcount. */
    turnoverPercent: Nullable<number>;
    /** Of everybody here today, in days. */
    averageTenureDays: Nullable<number>;
    months: HrHeadcountMonth[];
}

export interface HrTimeOffReport {
    from: string;
    to: string;
    /** Most taken first. */
    byType: HrTimeOffTaken[];
}

export interface HrTimeOffTaken {
    leaveTypeId: UUID;
    leaveTypeName: LocalizedText;
    isPaid: boolean;
    halfDays: number;
    peopleCount: number;
}
