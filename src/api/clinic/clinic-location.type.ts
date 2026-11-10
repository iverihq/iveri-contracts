import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ClinicResourceStatus } from './clinic-resource-status.enum.js';
import type { ClinicWorkingPeriod } from './clinic-staff.type.js';
import type { LocalizedText } from './localized-text.type.js';

export interface ClinicLocation {
    id: UUID;
    name: LocalizedText;
    city: LocalizedText;
    address: Nullable<string>;
    phone: Nullable<string>;
    /** An IANA zone such as `Asia/Tbilisi`. Times are stored in UTC and shown in this zone. */
    timeZone: string;
    /** The specialties this branch offers, which clients filter branches by. */
    specialtyIds: UUID[];
    status: ClinicResourceStatus;
    /** When the doors are open, which a visitor reads. Bookable times come from the staff's hours. */
    openingHours: ClinicWorkingPeriod[];
    latitude: Nullable<number>;
    longitude: Nullable<number>;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateClinicLocationRequest {
    name: LocalizedText;
    city: LocalizedText;
    address?: Nullable<string>;
    phone?: Nullable<string>;
    timeZone: string;
    specialtyIds?: UUID[];
    openingHours?: ClinicWorkingPeriod[];
    latitude?: Nullable<number>;
    longitude?: Nullable<number>;
}

export interface UpdateClinicLocationRequest {
    name?: LocalizedText;
    city?: LocalizedText;
    address?: Nullable<string>;
    phone?: Nullable<string>;
    timeZone?: string;
    specialtyIds?: UUID[];
    status?: ClinicResourceStatus;
    openingHours?: ClinicWorkingPeriod[];
    latitude?: Nullable<number>;
    longitude?: Nullable<number>;
}
