import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ClinicResourceStatus } from './clinic-resource-status.enum.js';

export interface ClinicRoom {
    id: UUID;
    locationId: UUID;
    name: string;
    status: ClinicResourceStatus;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateClinicRoomRequest {
    locationId: UUID;
    name: string;
}

export interface UpdateClinicRoomRequest {
    name?: string;
    status?: ClinicResourceStatus;
}
