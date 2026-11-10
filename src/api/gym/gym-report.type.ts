import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { GymBranchOccupancy } from './gym-branch.type.js';
import type { GymExpiringMembership } from './gym-membership.type.js';
import type { GymOwingMembership } from './gym-payment.type.js';
import type { GymSession } from './gym-schedule.type.js';

/** What the owner opens the panel to find out. Lands on what needs doing. */
export interface GymOverview {
    date: string;
    currency: string;
    activeMembers: number;
    joinedThisMonth: number;
    checkInsToday: number;
    takingsTodayMinor: number;
    newLeads: number;
    owingMinor: number;
    occupancy: GymBranchOccupancy[];
    sessionsToday: GymSession[];
    expiringSoon: GymExpiringMembership[];
    owing: GymOwingMembership[];
}

export interface GymRevenueDay {
    date: string;
    amountMinor: number;
}

export interface GymRevenuePlan {
    planId: UUID;
    name: LocalizedText;
    amountMinor: number;
    count: number;
}

export interface GymRevenueReport {
    from: string;
    to: string;
    currency: string;
    totalMinor: number;
    byDay: GymRevenueDay[];
    byPlan: GymRevenuePlan[];
}

export interface GymMembersMonth {
    /** `YYYY-MM`. */
    month: string;
    joined: number;
    ended: number;
    activeAtEnd: number;
}

export interface GymMembersReport {
    months: GymMembersMonth[];
}

export interface GymClassFill {
    classTypeId: UUID;
    name: LocalizedText;
    sessions: number;
    fillPercent: Nullable<number>;
    attended: number;
    noShows: number;
}

export interface GymClassReport {
    from: string;
    to: string;
    classes: GymClassFill[];
}

export interface GymPeakHour {
    dayOfWeek: number;
    hour: number;
    checkIns: number;
}

export interface GymPeakHoursReport {
    from: string;
    to: string;
    hours: GymPeakHour[];
}
