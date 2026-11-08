import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ClinicResourceStatus } from './clinic-resource-status.enum.js';

export interface ClinicDevice {
    id: UUID;
    locationId: UUID;
    name: string;
    /** A clinic-chosen key such as `co2-laser`, which a treatment names when it needs one. */
    deviceType: string;
    status: ClinicResourceStatus;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateClinicDeviceRequest {
    locationId: UUID;
    name: string;
    deviceType: string;
}

export interface UpdateClinicDeviceRequest {
    name?: string;
    deviceType?: string;
    status?: ClinicResourceStatus;
}
