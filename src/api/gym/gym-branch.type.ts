import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { GymBusyLevel } from './gym-busy-level.enum.js';
import type { GymMediaImage, GymWeeklyPeriod } from './gym-common.type.js';
import type { GymResourceStatus } from './gym-resource-status.enum.js';

export interface GymBranch {
    id: UUID;
    name: LocalizedText;
    city: LocalizedText;
    address: Nullable<string>;
    phone: Nullable<string>;
    /** IANA zone. Every weekly time at this branch is wall-clock time here. */
    timeZone: string;
    latitude: Nullable<number>;
    longitude: Nullable<number>;
    /** How many people the branch takes at once, which "how busy" is measured against. */
    capacity: number;
    openingHours: GymWeeklyPeriod[];
    photo: Nullable<GymMediaImage>;
    status: GymResourceStatus;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateGymBranchRequest {
    name: LocalizedText;
    city: LocalizedText;
    address?: Nullable<string>;
    phone?: Nullable<string>;
    timeZone: string;
    latitude?: Nullable<number>;
    longitude?: Nullable<number>;
    capacity: number;
    openingHours: GymWeeklyPeriod[];
    photo?: Nullable<GymMediaImage>;
}

export type UpdateGymBranchRequest = Partial<CreateGymBranchRequest> & { status?: GymResourceStatus };

/** How full a branch is right now. An estimate, because people rarely check out. */
export interface GymBranchOccupancy {
    branchId: UUID;
    people: number;
    capacity: number;
    level: GymBusyLevel;
}
