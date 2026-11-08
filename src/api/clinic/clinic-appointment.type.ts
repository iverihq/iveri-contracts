import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ClinicAppointmentStatus } from './clinic-appointment-status.enum.js';
import type { LocalizedText } from './localized-text.type.js';

/** One option as it was when the appointment was booked. A later price change does not touch it. */
export interface ClinicAppointmentLine {
    optionId: UUID;
    name: LocalizedText;
    durationMinutes: number;
    priceMinor: number;
}

export interface ClinicAppointment {
    id: UUID;
    locationId: UUID;
    staffMemberId: UUID;
    roomId: UUID;
    deviceId: Nullable<UUID>;
    clientId: UUID;
    clientName: string;
    clientPhone: string;
    treatmentId: UUID;
    treatmentName: LocalizedText;
    status: ClinicAppointmentStatus;
    startsAt: IsoDateTime;
    /** When the treatment itself finishes. */
    endsAt: IsoDateTime;
    /** When the specialist, the room and any machine are free again, which includes the buffer. */
    blockedUntil: IsoDateTime;
    currency: string;
    totalMinor: number;
    lines: ClinicAppointmentLine[];
    note: Nullable<string>;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateClinicAppointmentRequest {
    locationId: UUID;
    treatmentId: UUID;
    optionIds: UUID[];
    staffMemberId: UUID;
    clientId: UUID;
    startsAt: IsoDateTime;
    note?: Nullable<string>;
}

export interface ChangeClinicAppointmentStatusRequest {
    status: ClinicAppointmentStatus;
}
