import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { GymClassAccess } from './gym-class-access.enum.js';
import type { GymWeeklyPeriod } from './gym-common.type.js';
import type { GymDurationUnit } from './gym-duration-unit.enum.js';
import type { GymEntryKind } from './gym-entry-kind.enum.js';
import type { GymPlanActivation } from './gym-plan-activation.enum.js';
import type { GymResourceStatus } from './gym-resource-status.enum.js';

/**
 * Everything a gym sells has this one shape.
 *
 * An unlimited month, a ten-visit card, a class pack, an off-peak pass and a block of personal
 * training differ only in how much of entry, classes and training sessions they include.
 */
export interface GymPlan {
    id: UUID;
    name: LocalizedText;
    description: Nullable<LocalizedText>;
    entryKind: GymEntryKind;
    /** How many entries a `visits` plan holds. */
    entryVisits: Nullable<number>;
    classAccess: GymClassAccess;
    /** How many classes a `credits` plan holds. */
    classCredits: Nullable<number>;
    personalSessions: number;
    durationUnit: GymDurationUnit;
    durationValue: number;
    priceMinor: number;
    joiningFeeMinor: number;
    currency: string;
    /** Empty means every branch. */
    branchIds: UUID[];
    /** Null means every opening hour. A list is what off-peak is. */
    accessHours: Nullable<GymWeeklyPeriod[]>;
    freezeDaysAllowed: number;
    /** Whether a member may freeze this themselves or has to ask at the desk. */
    memberCanFreeze: boolean;
    activation: GymPlanActivation;
    /** Whether it is on the website and in the app. A staff-only plan can still be sold at the desk. */
    isPublic: boolean;
    isFeatured: boolean;
    sortOrder: number;
    status: GymResourceStatus;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateGymPlanRequest {
    name: LocalizedText;
    description?: Nullable<LocalizedText>;
    entryKind: GymEntryKind;
    entryVisits?: Nullable<number>;
    classAccess: GymClassAccess;
    classCredits?: Nullable<number>;
    personalSessions?: number;
    durationUnit: GymDurationUnit;
    durationValue: number;
    priceMinor: number;
    joiningFeeMinor?: number;
    branchIds?: UUID[];
    accessHours?: Nullable<GymWeeklyPeriod[]>;
    freezeDaysAllowed?: number;
    memberCanFreeze?: boolean;
    activation?: GymPlanActivation;
    isPublic?: boolean;
    isFeatured?: boolean;
    sortOrder?: number;
}

export type UpdateGymPlanRequest = Partial<CreateGymPlanRequest> & { status?: GymResourceStatus };
