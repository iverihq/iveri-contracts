import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ClinicPaymentMethod } from './clinic-payment-method.enum.js';
import type { ClinicResourceStatus } from './clinic-resource-status.enum.js';
import type { LocalizedText } from './localized-text.type.js';

/** A prepaid package the clinic offers: so many sessions of one option at one price. */
export interface ClinicCoursePlan {
    id: UUID;
    treatmentId: UUID;
    optionId: UUID;
    name: LocalizedText;
    sessionCount: number;
    priceMinor: number;
    currency: string;
    /** How long a sold course lasts, or `null` when it does not run out. */
    validityDays: Nullable<number>;
    status: ClinicResourceStatus;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateClinicCoursePlanRequest {
    optionId: UUID;
    name: LocalizedText;
    sessionCount: number;
    priceMinor: number;
    validityDays?: Nullable<number>;
}

export interface UpdateClinicCoursePlanRequest {
    name?: LocalizedText;
    sessionCount?: number;
    priceMinor?: number;
    validityDays?: Nullable<number>;
    status?: ClinicResourceStatus;
}

/** A course a client has bought, holding what was agreed then. A later change to the plan does not touch it. */
export interface ClinicCourse {
    id: UUID;
    clientId: UUID;
    planId: UUID;
    treatmentId: UUID;
    optionId: UUID;
    name: LocalizedText;
    sessionsTotal: number;
    sessionsUsed: number;
    priceMinor: number;
    currency: string;
    expiresAt: Nullable<IsoDateTime>;
    /** Set when the course was refunded, after which its remaining sessions are gone. */
    closedAt: Nullable<IsoDateTime>;
    createdAt: IsoDateTime;
}

export interface SellClinicCourseRequest {
    planId: UUID;
    locationId: UUID;
    method: ClinicPaymentMethod;
    note?: Nullable<string>;
}

/** A client's own view of a course they bought. */
export interface MyClinicCourse {
    id: UUID;
    treatmentId: UUID;
    name: LocalizedText;
    sessionsTotal: number;
    sessionsUsed: number;
    expiresAt: Nullable<IsoDateTime>;
    isClosed: boolean;
}
