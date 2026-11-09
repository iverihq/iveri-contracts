import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ClinicAppointmentStatus } from './clinic-appointment-status.enum.js';
import type { ClinicAppointmentLine } from './clinic-appointment.type.js';
import type { ClinicScreeningAnswerRequest, SignClinicConsentRequest } from './clinic-record.type.js';
import type { LocalizedText } from './localized-text.type.js';

/** A client's own view of a booking, without the room and machine the clinic assigned. */
export interface MyClinicAppointment {
    id: UUID;
    locationId: UUID;
    specialistName: string;
    treatmentId: UUID;
    treatmentName: LocalizedText;
    status: ClinicAppointmentStatus;
    startsAt: IsoDateTime;
    endsAt: IsoDateTime;
    currency: string;
    totalMinor: number;
    discountMinor: number;
    promotionName: Nullable<LocalizedText>;
    lines: ClinicAppointmentLine[];
    note: Nullable<string>;
    /** Whether the clinic's rules still let this client cancel it themselves. */
    canCancel: boolean;
    /** Whether this visit is over and has not been reviewed yet. */
    canReview: boolean;
}

/** Another time for a visit already booked. Everything agreed for it stays as it was. */
export interface RescheduleMyClinicAppointmentRequest {
    startsAt: IsoDateTime;
    staffMemberId: UUID;
}

export interface BookMyClinicAppointmentRequest {
    locationId: UUID;
    treatmentId: UUID;
    optionIds: UUID[];
    staffMemberId: UUID;
    startsAt: IsoDateTime;
    note?: Nullable<string>;
    /** One answer for each of the treatment's questions. Required when it has any. */
    screening?: ClinicScreeningAnswerRequest[];
    /** Required when the treatment has a consent form this client has not signed yet. */
    consent?: SignClinicConsentRequest;
}

/** What one client still has to do before booking one treatment. */
export interface MyClinicBookingStatus {
    /** Whether the booking has to carry a signature, which it does until the current form is signed. */
    needsConsent: boolean;
    /** When this client's next session may start, or `null` when nothing they have booked limits it. */
    nextSessionFrom: Nullable<IsoDateTime>;
}

export interface SaveMyClinicClientRequest {
    firstName: string;
    lastName: string;
    phone: string;
    email?: Nullable<string>;
    /** The language the client reads, which their emails are written in. */
    localeCode?: string;
}

/** The token from a confirmation link. It is the only thing the public route accepts. */
export interface ConfirmClinicEmailRequest {
    token: string;
}
