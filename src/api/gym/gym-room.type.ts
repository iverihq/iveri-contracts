import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { GymResourceStatus } from './gym-resource-status.enum.js';

export interface GymRoom {
    id: UUID;
    branchId: UUID;
    name: LocalizedText;
    capacity: number;
    /** An open area like the gym floor, where two sessions can run at once. */
    isShared: boolean;
    status: GymResourceStatus;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateGymRoomRequest {
    branchId: UUID;
    name: LocalizedText;
    capacity: number;
    isShared?: boolean;
}

export interface UpdateGymRoomRequest {
    name?: LocalizedText;
    capacity?: number;
    isShared?: boolean;
    status?: GymResourceStatus;
}
