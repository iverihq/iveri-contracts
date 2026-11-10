import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { GymCheckInOutcome } from './gym-check-in-outcome.enum.js';
import type { GymCheckInRefusal } from './gym-check-in-refusal.enum.js';
import type { GymMediaImage } from './gym-common.type.js';
import type { GymMembershipStatus } from './gym-membership-status.enum.js';

export interface GymDoorRequest {
    branchId: UUID;
    /** What the scanner read. Exactly one of this and `memberId`. */
    code?: string;
    memberId?: UUID;
    /** Lets somebody in whom the rules refused. Needs its own permission and is recorded. */
    overrideReason?: string;
}

export interface GymDoorMember {
    id: UUID;
    memberCode: string;
    displayName: string;
    photo: Nullable<GymMediaImage>;
    isBirthdayToday: boolean;
    isWaiverSigned: boolean;
    note: Nullable<string>;
}

export interface GymDoorMembership {
    id: UUID;
    name: LocalizedText;
    status: GymMembershipStatus;
    endsOn: Nullable<string>;
    visitsLeft: Nullable<number>;
    classCreditsLeft: Nullable<number>;
    owingMinor: number;
    currency: string;
}

export interface GymDoorBooking {
    bookingId: UUID;
    sessionId: UUID;
    className: LocalizedText;
    startsAt: IsoDateTime;
    roomName: Nullable<LocalizedText>;
}

export interface GymDoorDecision {
    checkInId: UUID;
    outcome: GymCheckInOutcome;
    refusal: Nullable<GymCheckInRefusal>;
    /** The same person was scanned moments ago, and this is that entry. */
    isDuplicate: boolean;
    at: IsoDateTime;
    member: Nullable<GymDoorMember>;
    membership: Nullable<GymDoorMembership>;
    upcomingBooking: Nullable<GymDoorBooking>;
}

export interface GymCheckIn {
    id: UUID;
    branchId: UUID;
    memberId: Nullable<UUID>;
    memberName: Nullable<string>;
    memberPhoto: Nullable<GymMediaImage>;
    membershipName: Nullable<LocalizedText>;
    outcome: GymCheckInOutcome;
    refusal: Nullable<GymCheckInRefusal>;
    overrideReason: Nullable<string>;
    createdAt: IsoDateTime;
}
