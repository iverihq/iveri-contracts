import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { GymMediaImage, GymWeeklyPeriod } from './gym-common.type.js';
import type { GymResourceStatus } from './gym-resource-status.enum.js';

/** Somebody who works at the gym. An account in identity, and everything the gym knows beyond that. */
export interface GymStaffMember {
    id: UUID;
    userId: Nullable<UUID>;
    displayName: string;
    phone: Nullable<string>;
    branchIds: UUID[];
    isTrainer: boolean;
    /** Whether members can book this trainer for personal training. */
    offersPersonal: boolean;
    personalSessionMinutes: number;
    classTypeIds: UUID[];
    /** When this trainer can take personal sessions. */
    workingHours: GymWeeklyPeriod[];
    title: Nullable<LocalizedText>;
    bio: Nullable<LocalizedText>;
    experienceYears: Nullable<number>;
    photo: Nullable<GymMediaImage>;
    status: GymResourceStatus;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateGymStaffMemberRequest {
    userId?: Nullable<UUID>;
    displayName: string;
    phone?: Nullable<string>;
    branchIds: UUID[];
    isTrainer?: boolean;
    offersPersonal?: boolean;
    personalSessionMinutes?: number;
    classTypeIds?: UUID[];
    workingHours?: GymWeeklyPeriod[];
    title?: Nullable<LocalizedText>;
    bio?: Nullable<LocalizedText>;
    experienceYears?: Nullable<number>;
    photo?: Nullable<GymMediaImage>;
}

export type UpdateGymStaffMemberRequest = Partial<CreateGymStaffMemberRequest> & { status?: GymResourceStatus };
