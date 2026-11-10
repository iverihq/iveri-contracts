import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { GymBusyLevel } from './gym-busy-level.enum.js';
import type { GymClassAccess } from './gym-class-access.enum.js';
import type { GymClassLevel } from './gym-class-level.enum.js';
import type { GymMediaImage, GymWeeklyPeriod } from './gym-common.type.js';
import type { GymDurationUnit } from './gym-duration-unit.enum.js';
import type { GymEntryKind } from './gym-entry-kind.enum.js';
import type { GymSocialLinks } from './gym-profile.type.js';
import type { GymSessionKind } from './gym-session-kind.enum.js';

/**
 * What anybody on the internet may read.
 *
 * Declared apart from the staff shapes on purpose. A field added to one of those does not reach
 * the public until somebody adds it here too.
 */
export interface PublicGym {
    slug: string;
    name: LocalizedText;
    tagline: Nullable<LocalizedText>;
    about: Nullable<LocalizedText>;
    socialLinks: Nullable<GymSocialLinks>;
    phone: Nullable<string>;
    email: Nullable<string>;
    logo: Nullable<GymMediaImage>;
    hero: Nullable<GymMediaImage>;
    currency: string;
    bookingHorizonDays: number;
    cancelCutoffMinutes: number;
}

export interface PublicGymBranch {
    id: UUID;
    name: LocalizedText;
    city: LocalizedText;
    address: Nullable<string>;
    phone: Nullable<string>;
    timeZone: string;
    latitude: Nullable<number>;
    longitude: Nullable<number>;
    openingHours: GymWeeklyPeriod[];
    photo: Nullable<GymMediaImage>;
    /** Never a head count: that is a claim the door cannot back. */
    busyLevel: GymBusyLevel;
}

export interface PublicGymPlan {
    id: UUID;
    name: LocalizedText;
    description: Nullable<LocalizedText>;
    entryKind: GymEntryKind;
    entryVisits: Nullable<number>;
    classAccess: GymClassAccess;
    classCredits: Nullable<number>;
    personalSessions: number;
    durationUnit: GymDurationUnit;
    durationValue: number;
    priceMinor: number;
    joiningFeeMinor: number;
    currency: string;
    branchIds: UUID[];
    accessHours: Nullable<GymWeeklyPeriod[]>;
    freezeDaysAllowed: number;
    isFeatured: boolean;
}

export interface PublicGymClassType {
    id: UUID;
    slug: string;
    name: LocalizedText;
    description: Nullable<LocalizedText>;
    level: GymClassLevel;
    durationMinutes: number;
    color: Nullable<string>;
    image: Nullable<GymMediaImage>;
}

export interface PublicGymTrainer {
    id: UUID;
    displayName: string;
    title: Nullable<LocalizedText>;
    bio: Nullable<LocalizedText>;
    experienceYears: Nullable<number>;
    photo: Nullable<GymMediaImage>;
    branchIds: UUID[];
    classTypeIds: UUID[];
    offersPersonal: boolean;
}

export interface PublicGymSession {
    id: UUID;
    kind: GymSessionKind;
    branchId: UUID;
    roomName: Nullable<LocalizedText>;
    classTypeId: Nullable<UUID>;
    className: Nullable<LocalizedText>;
    color: Nullable<string>;
    trainerId: UUID;
    trainerName: string;
    startsAt: IsoDateTime;
    endsAt: IsoDateTime;
    capacity: number;
    placesLeft: number;
    waitlistCount: number;
}

export interface PublicGymGalleryItem {
    id: UUID;
    image: GymMediaImage;
    caption: Nullable<LocalizedText>;
}

/** What a promo code takes off a plan, checked before somebody pays. */
export interface GymPromoQuote {
    code: string;
    discountPercent: number;
    discountMinor: number;
    totalMinor: number;
}
