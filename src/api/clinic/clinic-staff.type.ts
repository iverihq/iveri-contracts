import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ClinicResourceStatus } from './clinic-resource-status.enum.js';

/** One stretch of a weekly schedule, read in the location's own time zone. */
export interface ClinicWorkingPeriod {
    /** ISO weekday: 1 is Monday and 7 is Sunday. */
    dayOfWeek: number;
    /** 24-hour `HH:mm`. */
    startTime: string;
    /** 24-hour `HH:mm`, later than `startTime`. */
    endTime: string;
}

export interface ClinicStaffMember {
    id: UUID;
    /** The identity account this person signs in with. */
    userId: UUID;
    locationId: UUID;
    displayName: string;
    status: ClinicResourceStatus;
    /** The treatments this person may perform. */
    treatmentIds: UUID[];
    workingHours: ClinicWorkingPeriod[];
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateClinicStaffMemberRequest {
    userId: UUID;
    locationId: UUID;
    displayName: string;
}

export interface UpdateClinicStaffMemberRequest {
    locationId?: UUID;
    displayName?: string;
    status?: ClinicResourceStatus;
}

export interface ReplaceClinicStaffTreatmentsRequest {
    treatmentIds: UUID[];
}

export interface ReplaceClinicWorkingHoursRequest {
    periods: ClinicWorkingPeriod[];
}

export interface ClinicTimeOff {
    id: UUID;
    staffMemberId: UUID;
    startsAt: IsoDateTime;
    endsAt: IsoDateTime;
    reason: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface CreateClinicTimeOffRequest {
    startsAt: IsoDateTime;
    endsAt: IsoDateTime;
    reason?: Nullable<string>;
}
