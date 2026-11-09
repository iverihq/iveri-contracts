import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ClinicAppointmentStatus } from './clinic-appointment-status.enum.js';
import type { ClinicConsentForm } from './clinic-consent-form.type.js';
import type { ClinicRecordAccessAction } from './clinic-record-access-action.enum.js';
import type { ClinicRecordMethod } from './clinic-record-method.enum.js';
import type { ClinicScreeningQuestion } from './clinic-screening-question.type.js';
import type { LocalizedText } from './localized-text.type.js';

export interface ClinicScreeningAnswerRequest {
    questionId: UUID;
    answer: boolean;
}

/** An answer beside the question as it read when it was asked, which is what gives it meaning. */
export interface ClinicScreeningAnswer {
    questionId: UUID;
    question: LocalizedText;
    answer: boolean;
    /** Whether this answer is the one that rules the treatment out. */
    isFlagged: boolean;
}

export interface ClinicScreening {
    id: UUID;
    appointmentId: UUID;
    treatmentId: UUID;
    treatmentName: LocalizedText;
    answers: ClinicScreeningAnswer[];
    hasFlaggedAnswer: boolean;
    method: ClinicRecordMethod;
    recordedByName: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface RecordClinicScreeningRequest {
    answers: ClinicScreeningAnswerRequest[];
}

export interface SignClinicConsentRequest {
    /** The version that was on screen, so nobody signs one they have not read. */
    version: number;
    /** The language of the text that was on screen. The form must be written in it. */
    locale: string;
    signedName: string;
}

/** The exact text somebody agreed to, kept whatever later happens to the form. */
export interface ClinicConsentSignature {
    id: UUID;
    appointmentId: UUID;
    treatmentId: UUID;
    treatmentName: LocalizedText;
    version: number;
    locale: string;
    text: string;
    signedName: string;
    method: ClinicRecordMethod;
    recordedByName: Nullable<string>;
    signedAt: IsoDateTime;
}

/** A setting used for the session, such as a fluence or a needle depth, as the specialist wrote it. */
export interface ClinicTreatmentParameter {
    name: string;
    value: string;
}

/** What was done at one session. It is never edited: a correction is a new entry pointing at it. */
export interface ClinicTreatmentLogEntry {
    id: UUID;
    appointmentId: UUID;
    treatmentId: UUID;
    treatmentName: LocalizedText;
    specialistName: string;
    parameters: ClinicTreatmentParameter[];
    reaction: Nullable<string>;
    notes: Nullable<string>;
    /** Why the session went ahead despite a flagged screening answer. */
    overrideReason: Nullable<string>;
    correctsEntryId: Nullable<UUID>;
    correctionReason: Nullable<string>;
    /** The entry that replaced this one, or `null` while this is the one that stands. */
    correctedByEntryId: Nullable<UUID>;
    recordedByName: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface CreateClinicTreatmentLogEntryRequest {
    parameters: ClinicTreatmentParameter[];
    reaction?: Nullable<string>;
    notes?: Nullable<string>;
    /** Required when the latest screening has a flagged answer, and refused when it has none. */
    overrideReason?: Nullable<string>;
}

export interface CorrectClinicTreatmentLogEntryRequest {
    parameters: ClinicTreatmentParameter[];
    reaction?: Nullable<string>;
    notes?: Nullable<string>;
    reason: string;
}

/** Everything a specialist needs in the room for one visit. */
export interface ClinicVisitRecord {
    appointmentId: UUID;
    clientId: UUID;
    clientName: string;
    treatmentId: UUID;
    treatmentName: LocalizedText;
    specialistName: string;
    status: ClinicAppointmentStatus;
    startsAt: IsoDateTime;
    questions: ClinicScreeningQuestion[];
    screening: Nullable<ClinicScreening>;
    /** The form's current version, or `null` when this treatment has none. */
    consentForm: Nullable<ClinicConsentForm>;
    /** The signature of that version, or `null` when it has not been signed. */
    consent: Nullable<ClinicConsentSignature>;
    /** The session's entry and its corrections, oldest first. */
    entries: ClinicTreatmentLogEntry[];
}

/** A client's whole history at this clinic, newest first. */
export interface ClinicClientRecord {
    clientId: UUID;
    clientName: string;
    consents: ClinicConsentSignature[];
    screenings: ClinicScreening[];
    entries: ClinicTreatmentLogEntry[];
}

export interface ClinicRecordAccess {
    id: UUID;
    actorUserId: UUID;
    /** The member of staff who read it, or `null` for an account that is not one. */
    actorName: Nullable<string>;
    appointmentId: Nullable<UUID>;
    action: ClinicRecordAccessAction;
    createdAt: IsoDateTime;
}
