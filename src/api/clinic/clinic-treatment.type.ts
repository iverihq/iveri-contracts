import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ClinicMediaImage } from './clinic-media.type.js';
import type { ClinicResourceStatus } from './clinic-resource-status.enum.js';
import type { LocalizedText } from './localized-text.type.js';

/** One way of buying a treatment. A laser zone is an option; a treatment that does not vary has one. */
export interface ClinicTreatmentOption {
    id: UUID;
    name: LocalizedText;
    durationMinutes: number;
    /** Integer minor units of the treatment's currency. */
    priceMinor: number;
    sortOrder: number;
}

export interface ClinicTreatmentFaq {
    question: LocalizedText;
    answer: LocalizedText;
}

/** What a treatment's page says about it. Every part may be left empty. */
export interface ClinicTreatmentContent {
    benefits: LocalizedText[];
    steps: LocalizedText[];
    preparation: Nullable<LocalizedText>;
    aftercare: Nullable<LocalizedText>;
    faq: ClinicTreatmentFaq[];
    /** How many sessions a course usually takes, which is advice and limits nothing. */
    recommendedSessions: Nullable<number>;
}

export interface ClinicTreatment {
    id: UUID;
    specialtyId: UUID;
    name: LocalizedText;
    description: Nullable<LocalizedText>;
    currency: string;
    /** Rest time held after the treatment, for cleaning a room or cooling a device. */
    bufferMinutes: number;
    /** The device type this treatment occupies, or `null` when it needs none. */
    requiredDeviceType: Nullable<string>;
    /** The shortest gap a client may leave between sessions, or `null` when any gap is safe. */
    minDaysBetweenSessions: Nullable<number>;
    isBookableOnline: boolean;
    status: ClinicResourceStatus;
    options: ClinicTreatmentOption[];
    content: ClinicTreatmentContent;
    image: Nullable<ClinicMediaImage>;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateClinicTreatmentOptionRequest {
    name: LocalizedText;
    durationMinutes: number;
    priceMinor: number;
}

export interface UpdateClinicTreatmentOptionRequest {
    name?: LocalizedText;
    durationMinutes?: number;
    priceMinor?: number;
    sortOrder?: number;
}

export interface CreateClinicTreatmentRequest {
    specialtyId: UUID;
    name: LocalizedText;
    description?: Nullable<LocalizedText>;
    currency: string;
    bufferMinutes?: number;
    requiredDeviceType?: Nullable<string>;
    minDaysBetweenSessions?: Nullable<number>;
    isBookableOnline?: boolean;
    options: CreateClinicTreatmentOptionRequest[];
    content?: ClinicTreatmentContent;
}

export interface UpdateClinicTreatmentRequest {
    specialtyId?: UUID;
    name?: LocalizedText;
    description?: Nullable<LocalizedText>;
    bufferMinutes?: number;
    requiredDeviceType?: Nullable<string>;
    minDaysBetweenSessions?: Nullable<number>;
    isBookableOnline?: boolean;
    status?: ClinicResourceStatus;
    content?: ClinicTreatmentContent;
}
