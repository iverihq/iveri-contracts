import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { GymClassAccess } from './gym-class-access.enum.js';
import type { GymWeeklyPeriod } from './gym-common.type.js';
import type { GymEntryKind } from './gym-entry-kind.enum.js';
import type { GymMembershipStatus } from './gym-membership-status.enum.js';
import type { GymPaymentMethod } from './gym-payment-method.enum.js';

export interface GymMembershipFreeze {
    id: UUID;
    startsOn: string;
    endsOn: string;
    reason: Nullable<string>;
    /** Set when the member came back early and the unused days were returned. */
    endedEarlyOn: Nullable<string>;
    createdAt: IsoDateTime;
}

/** A copy of the plan as it was when sold. Changing the plan later does not touch it. */
export interface GymMembership {
    id: UUID;
    memberId: UUID;
    memberName: string;
    planId: UUID;
    name: LocalizedText;
    status: GymMembershipStatus;
    /** Null until the first visit, on a plan whose clock starts then. */
    startsOn: Nullable<string>;
    endsOn: Nullable<string>;
    branchIds: UUID[];
    accessHours: Nullable<GymWeeklyPeriod[]>;
    entryKind: GymEntryKind;
    entryVisits: Nullable<number>;
    visitsUsed: number;
    classAccess: GymClassAccess;
    classCredits: Nullable<number>;
    classCreditsUsed: number;
    personalSessions: number;
    personalSessionsUsed: number;
    freezeDaysAllowed: number;
    freezeDaysUsed: number;
    memberCanFreeze: boolean;
    freezes: GymMembershipFreeze[];
    currency: string;
    priceMinor: number;
    joiningFeeMinor: number;
    discountMinor: number;
    promoCode: Nullable<string>;
    /** What the member owes in all, after any discount. */
    totalMinor: number;
    paidMinor: number;
    owingMinor: number;
    note: Nullable<string>;
    cancelledAt: Nullable<IsoDateTime>;
    cancelReason: Nullable<string>;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface SellGymMembershipRequest {
    memberId: UUID;
    planId: UUID;
    /** Calendar date. Absent means today, or the day after the current one of this plan ends. */
    startsOn?: string;
    discountMinor?: number;
    promoCode?: string;
    note?: Nullable<string>;
    /** Money taken at the sale. Absent or part of the price leaves the rest owing. */
    payment?: {
        amountMinor: number;
        method: GymPaymentMethod;
        branchId: UUID;
    };
}

export interface FreezeGymMembershipRequest {
    startsOn: string;
    endsOn: string;
    reason?: Nullable<string>;
}

export interface EndGymFreezeRequest {
    endsOn: string;
}

export interface CancelGymMembershipRequest {
    reason: string;
}

/** A membership about to run out, for the people who ring and ask. */
export interface GymExpiringMembership {
    membershipId: UUID;
    memberId: UUID;
    memberName: string;
    phone: Nullable<string>;
    name: LocalizedText;
    endsOn: string;
}
