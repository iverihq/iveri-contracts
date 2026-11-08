import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ClinicResourceStatus } from './clinic-resource-status.enum.js';
import type { LocalizedText } from './localized-text.type.js';

/** A line of work such as cosmetology or laser epilation, which a clinic organises treatments by. */
export interface ClinicSpecialty {
    id: UUID;
    name: LocalizedText;
    /** Fixed after creation, because a public address names it. */
    slug: string;
    sortOrder: number;
    status: ClinicResourceStatus;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateClinicSpecialtyRequest {
    name: LocalizedText;
    slug: string;
}

export interface UpdateClinicSpecialtyRequest {
    name?: LocalizedText;
    sortOrder?: number;
    status?: ClinicResourceStatus;
}
