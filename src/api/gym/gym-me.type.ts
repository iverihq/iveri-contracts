import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { GymBookingStatus } from './gym-booking-status.enum.js';
import type { GymMediaImage } from './gym-common.type.js';
import type { GymMembership, GymMembershipFreeze } from './gym-membership.type.js';
import type { GymPaymentKind } from './gym-payment-kind.enum.js';
import type { GymPaymentMethod } from './gym-payment-method.enum.js';
import type { PublicGymSession } from './gym-public.type.js';
import type { GymWaiver } from './gym-waiver.type.js';

/** A member's own record, as they see it. Staff notes and tags are not part of it. */
export interface GymMyProfile {
    id: UUID;
    memberCode: string;
    firstName: string;
    lastName: string;
    displayName: string;
    email: Nullable<string>;
    isEmailConfirmed: boolean;
    phone: Nullable<string>;
    birthDate: Nullable<string>;
    homeBranchId: UUID;
    photo: Nullable<GymMediaImage>;
    emergencyContactName: Nullable<string>;
    emergencyContactPhone: Nullable<string>;
    weeklyTarget: number;
    /** The language their emails are written in. */
    localeCode: Nullable<string>;
    isWaiverSigned: boolean;
    /** What still has to be signed, or null when nothing does. */
    waiverToSign: Nullable<GymWaiver>;
}

export interface JoinGymRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone?: Nullable<string>;
    birthDate?: Nullable<string>;
    homeBranchId: UUID;
    localeCode?: Nullable<string>;
}

/** Ties the signed-in account to the record the desk already holds. */
export interface LinkGymMemberRequest {
    code: string;
}

export interface UpdateGymMyProfileRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: Nullable<string>;
    birthDate?: Nullable<string>;
    homeBranchId?: UUID;
    emergencyContactName?: Nullable<string>;
    emergencyContactPhone?: Nullable<string>;
    localeCode?: Nullable<string>;
}

/**
 * What the phone needs to make an entry code with no signal.
 *
 * The key is one member's and is cancelled by issuing another. `serverTime` lets the phone measure
 * how far its own clock is out, so a phone set wrong still produces a code that works.
 */
export interface GymMyPass {
    memberCode: string;
    passKey: string;
    stepSeconds: number;
    serverTime: IsoDateTime;
}

export type GymMyMembership = Omit<GymMembership, 'memberId' | 'memberName' | 'note' | 'promoCode' | 'freezes'> & {
    freezes: GymMembershipFreeze[];
    freezeDaysLeft: number;
    canFreeze: boolean;
    visitsLeft: Nullable<number>;
    classCreditsLeft: Nullable<number>;
    personalSessionsLeft: number;
};

export interface BuyGymMembershipRequest {
    planId: UUID;
    startsOn?: string;
    promoCode?: string;
    /** Where the bank sends them afterwards. Refused unless its origin is on this service's list. */
    returnUrl: string;
}

export interface GymCheckout {
    membershipId: UUID;
    checkoutUrl: string;
}

export interface FreezeMyGymMembershipRequest {
    startsOn: string;
    endsOn: string;
    reason?: Nullable<string>;
}

export interface GymMyBooking {
    id: UUID;
    status: GymBookingStatus;
    spotNumber: Nullable<number>;
    waitlistPosition: Nullable<number>;
    session: PublicGymSession;
    canCancel: boolean;
    /** Cancelling now would keep what the booking cost. */
    isLateCancel: boolean;
}

export interface CreateMyGymPersonalSessionRequest {
    branchId: UUID;
    trainerId: UUID;
    startsAt: IsoDateTime;
    durationMinutes?: number;
}

export interface GymMyVisit {
    id: UUID;
    branchId: UUID;
    branchName: LocalizedText;
    at: IsoDateTime;
}

export interface GymMyPayment {
    id: UUID;
    kind: GymPaymentKind;
    method: GymPaymentMethod;
    amountMinor: number;
    currency: string;
    membershipName: LocalizedText;
    createdAt: IsoDateTime;
}

export interface SignMyGymWaiverRequest {
    signedName: string;
    locale: string;
}

export interface ConfirmGymEmailRequest {
    token: string;
}
