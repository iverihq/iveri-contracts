import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ClinicAppointmentStatus } from './clinic-appointment-status.enum.js';
import type { ClinicCourse, MyClinicCourse } from './clinic-course.type.js';
import type { ClinicPaymentMethod } from './clinic-payment-method.enum.js';
import type { LocalizedText } from './localized-text.type.js';

/** One line in the clinic's ledger. It is never edited: money given back is a new line pointing at it. */
export interface ClinicPayment {
    id: UUID;
    locationId: UUID;
    clientId: UUID;
    clientName: string;
    /** The visit this was for, or `null` when it paid for a course. */
    appointmentId: Nullable<UUID>;
    /** The course this sold or used, or `null` when no course was involved. */
    courseId: Nullable<UUID>;
    method: ClinicPaymentMethod;
    /** Negative for a refund. */
    amountMinor: number;
    currency: string;
    refundsPaymentId: Nullable<UUID>;
    /** Why money was given back. Only a refund has one. */
    reason: Nullable<string>;
    note: Nullable<string>;
    /** How much of this can still be given back. Always zero on a refund. */
    refundableMinor: number;
    recordedByName: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface RecordClinicPaymentRequest {
    method: ClinicPaymentMethod;
    /** Required except for a course, whose session is worth what its line on the visit costs. */
    amountMinor?: number;
    /** Required for a course. */
    courseId?: UUID;
    note?: Nullable<string>;
}

export interface RefundClinicPaymentRequest {
    /** Omitted to give back everything left. A course session or bonus is always given back whole. */
    amountMinor?: number;
    reason: string;
}

export interface ClinicBonusBalance {
    currency: string;
    amountMinor: number;
}

/** What reception needs at the desk for one visit. */
export interface ClinicVisitPayments {
    appointmentId: UUID;
    clientId: UUID;
    clientName: string;
    locationId: UUID;
    treatmentName: LocalizedText;
    status: ClinicAppointmentStatus;
    currency: string;
    totalMinor: number;
    paidMinor: number;
    dueMinor: number;
    payments: ClinicPayment[];
    /** This client's bonus in the visit's currency. */
    bonusBalanceMinor: number;
    /** This client's courses that can pay for a line of this visit. */
    usableCourses: ClinicCourse[];
}

/** How much has been paid towards one visit. */
export interface ClinicVisitBalance {
    appointmentId: UUID;
    paidMinor: number;
}

export interface ClinicClientAccount {
    clientId: UUID;
    clientName: string;
    bonusBalances: ClinicBonusBalance[];
    courses: ClinicCourse[];
    /** The newest payments, whatever they were for. */
    payments: ClinicPayment[];
}

/** One currency's day. The three money figures are net of refunds, so cash is what the drawer should hold. */
export interface ClinicTakingsLine {
    currency: string;
    cashMinor: number;
    cardMinor: number;
    transferMinor: number;
    netMinor: number;
    refundedMinor: number;
    courseRedeemedMinor: number;
    bonusSpentMinor: number;
}

/** A visit that finished with money still owing. */
export interface ClinicUnsettledVisit {
    appointmentId: UUID;
    clientName: string;
    treatmentName: LocalizedText;
    currency: string;
    totalMinor: number;
    paidMinor: number;
    dueMinor: number;
}

export interface ClinicDailyTakings {
    locationId: UUID;
    /** The branch's own calendar day, `YYYY-MM-DD`. */
    date: string;
    lines: ClinicTakingsLine[];
    payments: ClinicPayment[];
    unsettled: ClinicUnsettledVisit[];
}

/** What a client holds at this clinic. */
export interface MyClinicWallet {
    bonusBalances: ClinicBonusBalance[];
    courses: MyClinicCourse[];
}
