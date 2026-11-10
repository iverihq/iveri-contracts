import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { GymLeadKind } from './gym-lead-kind.enum.js';
import type { GymLeadStatus } from './gym-lead-status.enum.js';

/** Somebody who asked. Not a member: nobody has confirmed this person exists. */
export interface GymLead {
    id: UUID;
    kind: GymLeadKind;
    status: GymLeadStatus;
    name: string;
    phone: string;
    email: Nullable<string>;
    message: Nullable<string>;
    branchId: Nullable<UUID>;
    note: Nullable<string>;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateGymLeadRequest {
    kind: GymLeadKind;
    name: string;
    phone: string;
    email?: Nullable<string>;
    message?: Nullable<string>;
    branchId?: Nullable<UUID>;
    consentGiven: boolean;
}

export interface UpdateGymLeadRequest {
    status?: GymLeadStatus;
    note?: Nullable<string>;
}
