import type { IsoDateTime } from '../../type/iso-date-time.type.js';
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

/** A published review. It names a client only if they agreed, and otherwise `authorName` is null. */
export interface PublicReview {
    id: UUID;
    rating: number;
    comment: Nullable<string>;
    authorName: Nullable<string>;
    treatmentId: UUID;
    treatmentName: LocalizedText;
    staffMemberId: UUID;
    specialistName: string;
    createdAt: IsoDateTime;
}

/** The newest published reviews, and what all of those matching the filter add up to. */
export interface PublicReviewList {
    averageRating: Nullable<number>;
    count: number;
    items: PublicReview[];
}

export interface PublicScreeningQuestion {
    id: UUID;
    text: LocalizedText;
    /** The answer that rules the treatment out, or `null` when it is only for the specialist to read. */
    stopsBookingOn: Nullable<boolean>;
}

export interface PublicConsentForm {
    version: number;
    body: LocalizedText;
}

/**
 * What a treatment asks of somebody before it can be booked.
 *
 * The rule travels with the question so a client can stop at the answer that rules it out, without
 * sending somebody's health information anywhere when no booking is going to follow.
 */
export interface PublicBookingForm {
    questions: PublicScreeningQuestion[];
    consent: Nullable<PublicConsentForm>;
}
