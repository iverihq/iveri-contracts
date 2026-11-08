import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

/** Somebody the clinic treats. They need no account to be booked by reception. */
export interface ClinicClient {
    id: UUID;
    firstName: string;
    lastName: string;
    phone: string;
    email: Nullable<string>;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateClinicClientRequest {
    firstName: string;
    lastName: string;
    phone: string;
    email?: Nullable<string>;
}

export interface UpdateClinicClientRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: Nullable<string>;
}
