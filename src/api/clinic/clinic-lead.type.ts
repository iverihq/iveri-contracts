import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ClinicLeadKind } from './clinic-lead-kind.enum.js';
import type { ClinicLeadStatus } from './clinic-lead-status.enum.js';

/** Somebody who asked the clinic to call them back, or asked it something. */
export interface ClinicLead {
    id: UUID;
    kind: ClinicLeadKind;
    status: ClinicLeadStatus;
    name: string;
    phone: string;
    message: Nullable<string>;
    locationId: Nullable<UUID>;
    treatmentId: Nullable<UUID>;
    /** When this person agreed to be contacted. A lead cannot exist without it. */
    consentedAt: IsoDateTime;
    handledAt: Nullable<IsoDateTime>;
    createdAt: IsoDateTime;
}

export interface CreateClinicLeadRequest {
    kind: ClinicLeadKind;
    name: string;
    phone: string;
    message?: Nullable<string>;
    locationId?: Nullable<UUID>;
    treatmentId?: Nullable<UUID>;
    hasPrivacyConsent: boolean;
}

export interface ChangeClinicLeadStatusRequest {
    status: ClinicLeadStatus;
}
