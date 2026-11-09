import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ClinicReviewStatus } from './clinic-review-status.enum.js';
import type { LocalizedText } from './localized-text.type.js';

/** A client's review of a visit they actually had, as the clinic's staff read it. */
export interface ClinicReview {
    id: UUID;
    appointmentId: UUID;
    clientName: string;
    treatmentId: UUID;
    treatmentName: LocalizedText;
    staffMemberId: UUID;
    specialistName: string;
    locationId: UUID;
    rating: number;
    comment: Nullable<string>;
    /** Whether the client agreed to be named once this is published. */
    isNamePublic: boolean;
    status: ClinicReviewStatus;
    createdAt: IsoDateTime;
}

export interface ChangeClinicReviewStatusRequest {
    status: ClinicReviewStatus;
}

export interface SubmitClinicReviewRequest {
    rating: number;
    comment?: Nullable<string>;
    isNamePublic: boolean;
}
