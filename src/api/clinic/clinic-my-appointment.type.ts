import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ClinicAppointmentStatus } from './clinic-appointment-status.enum.js';
import type { ClinicAppointmentLine } from './clinic-appointment.type.js';
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
}

export interface BookMyClinicAppointmentRequest {
    locationId: UUID;
    treatmentId: UUID;
    optionIds: UUID[];
    staffMemberId: UUID;
    startsAt: IsoDateTime;
    note?: Nullable<string>;
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
