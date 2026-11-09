import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { LocalizedText } from './localized-text.type.js';

/**
 * What anybody on the internet may read.
 *
 * Declared apart from the staff shapes on purpose. A field added to one of those does not reach
 * the public until somebody adds it here too.
 */
export interface PublicClinic {
    slug: string;
    name: LocalizedText;
    tagline: Nullable<LocalizedText>;
    phone: Nullable<string>;
    email: Nullable<string>;
    bookingHorizonDays: number;
}

export interface PublicSpecialty {
    id: UUID;
    slug: string;
    name: LocalizedText;
}

export interface PublicBranch {
    id: UUID;
    name: LocalizedText;
    city: LocalizedText;
    address: Nullable<string>;
    phone: Nullable<string>;
    timeZone: string;
    specialtyIds: UUID[];
}

export interface PublicTreatmentOption {
    id: UUID;
    name: LocalizedText;
    durationMinutes: number;
    priceMinor: number;
    /** The price under the treatment's promotion, or null when there is none. */
    promotionPriceMinor: Nullable<number>;
}

/** The best promotion running today for one treatment. */
export interface PublicTreatmentPromotion {
    id: UUID;
    name: LocalizedText;
    discountPercent: number;
    endsOn: string;
    /** Where it applies. Booking at any other branch costs the full price. */
    locationIds: UUID[];
}

export interface PublicTreatment {
    id: UUID;
    specialtyId: UUID;
    name: LocalizedText;
    description: Nullable<LocalizedText>;
    currency: string;
    minDaysBetweenSessions: Nullable<number>;
    isBookableOnline: boolean;
    options: PublicTreatmentOption[];
    promotion: Nullable<PublicTreatmentPromotion>;
}

export interface PublicSpecialist {
    id: UUID;
    displayName: string;
    locationId: UUID;
    treatmentIds: UUID[];
}

/** A promotion running today, biggest discount first. */
export interface PublicPromotion {
    id: UUID;
    name: LocalizedText;
    description: Nullable<LocalizedText>;
    discountPercent: number;
    startsOn: string;
    endsOn: string;
    showInBanner: boolean;
    treatmentIds: UUID[];
    locationIds: UUID[];
}
