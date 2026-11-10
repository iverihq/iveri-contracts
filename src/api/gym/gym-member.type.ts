import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { GymMediaImage } from './gym-common.type.js';
import type { GymMembershipStatus } from './gym-membership-status.enum.js';
import type { GymResourceStatus } from './gym-resource-status.enum.js';

export interface GymMemberSummary {
    id: UUID;
    /** A short number printed on a card and read over the phone. */
    memberCode: string;
    displayName: string;
    email: Nullable<string>;
    phone: Nullable<string>;
    photo: Nullable<GymMediaImage>;
    homeBranchId: UUID;
    hasAccount: boolean;
    /** The membership that counts today, or null when there is none. */
    membershipStatus: Nullable<GymMembershipStatus>;
    membershipName: Nullable<LocalizedText>;
    membershipEndsOn: Nullable<string>;
    owingMinor: number;
    lastVisitAt: Nullable<IsoDateTime>;
    createdAt: IsoDateTime;
}

export interface GymMember extends GymMemberSummary {
    firstName: string;
    lastName: string;
    birthDate: Nullable<string>;
    emergencyContactName: Nullable<string>;
    emergencyContactPhone: Nullable<string>;
    note: Nullable<string>;
    tags: string[];
    weeklyTarget: number;
    isEmailConfirmed: boolean;
    isWaiverSigned: boolean;
    status: GymResourceStatus;
    updatedAt: IsoDateTime;
}

export interface CreateGymMemberRequest {
    firstName: string;
    lastName: string;
    email?: Nullable<string>;
    phone?: Nullable<string>;
    birthDate?: Nullable<string>;
    homeBranchId: UUID;
    emergencyContactName?: Nullable<string>;
    emergencyContactPhone?: Nullable<string>;
    note?: Nullable<string>;
    tags?: string[];
    photo?: Nullable<GymMediaImage>;
}

export type UpdateGymMemberRequest = Partial<CreateGymMemberRequest> & { status?: GymResourceStatus };
