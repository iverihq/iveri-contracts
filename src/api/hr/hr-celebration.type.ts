import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

export interface HrCelebrationPerson {
    employeeId: UUID;
    name: string;
    jobTitleName: Nullable<string>;
    departmentName: Nullable<string>;
    /** The day this week it falls on, or a newcomer's first day. A birthday carries no year of birth. */
    date: string;
    /** Whole years here, for a work anniversary. */
    years: Nullable<number>;
}

export interface HrCelebrations {
    /** This week's Monday. */
    weekStart: string;
    weekEnd: string;
    anniversaries: HrCelebrationPerson[];
    /** Only people who chose to share theirs. */
    birthdays: HrCelebrationPerson[];
    /** Everybody who joined this month so far. */
    newJoiners: HrCelebrationPerson[];
}
