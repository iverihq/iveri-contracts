import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { GymBookingStatus } from './gym-booking-status.enum.js';
import type { GymMediaImage } from './gym-common.type.js';
import type { GymResourceStatus } from './gym-resource-status.enum.js';
import type { GymSessionKind } from './gym-session-kind.enum.js';
import type { GymSessionStatus } from './gym-session-status.enum.js';

/** "Tuesdays at 18:00 in Studio 2 with this trainer", in the branch's own wall-clock time. */
export interface GymClassTemplate {
    id: UUID;
    branchId: UUID;
    roomId: Nullable<UUID>;
    classTypeId: UUID;
    className: LocalizedText;
    trainerId: UUID;
    trainerName: string;
    dayOfWeek: number;
    startTime: string;
    durationMinutes: number;
    capacity: number;
    validFrom: string;
    validUntil: Nullable<string>;
    status: GymResourceStatus;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateGymClassTemplateRequest {
    branchId: UUID;
    roomId?: Nullable<UUID>;
    classTypeId: UUID;
    trainerId: UUID;
    dayOfWeek: number;
    startTime: string;
    durationMinutes?: number;
    capacity?: number;
    validFrom: string;
    validUntil?: Nullable<string>;
}

export type UpdateGymClassTemplateRequest = Partial<Omit<CreateGymClassTemplateRequest, 'branchId'>> & {
    status?: GymResourceStatus;
};

/** One dated occurrence: a class with many places, or personal training with one. */
export interface GymSession {
    id: UUID;
    kind: GymSessionKind;
    branchId: UUID;
    roomId: Nullable<UUID>;
    roomName: Nullable<LocalizedText>;
    classTypeId: Nullable<UUID>;
    className: Nullable<LocalizedText>;
    color: Nullable<string>;
    trainerId: UUID;
    trainerName: string;
    trainerPhoto: Nullable<GymMediaImage>;
    startsAt: IsoDateTime;
    endsAt: IsoDateTime;
    capacity: number;
    bookedCount: number;
    waitlistCount: number;
    status: GymSessionStatus;
    cancelReason: Nullable<string>;
    templateId: Nullable<UUID>;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface GymBooking {
    id: UUID;
    sessionId: UUID;
    memberId: UUID;
    memberName: string;
    memberPhoto: Nullable<GymMediaImage>;
    status: GymBookingStatus;
    /** Null while waitlisted or once given up. */
    spotNumber: Nullable<number>;
    /** Null unless waitlisted. 1 is next. */
    waitlistPosition: Nullable<number>;
    membershipId: UUID;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/** A booking seen from the member's side, for their page in the panel. */
export interface GymMemberBooking {
    id: UUID;
    status: GymBookingStatus;
    spotNumber: Nullable<number>;
    waitlistPosition: Nullable<number>;
    session: GymSession;
}

export interface GymSessionDetail extends GymSession {
    bookings: GymBooking[];
}

export interface CreateGymSessionRequest {
    branchId: UUID;
    roomId?: Nullable<UUID>;
    classTypeId: UUID;
    trainerId: UUID;
    startsAt: IsoDateTime;
    durationMinutes?: number;
    capacity?: number;
}

export interface UpdateGymSessionRequest {
    roomId?: Nullable<UUID>;
    trainerId?: UUID;
    capacity?: number;
}

export interface CancelGymSessionRequest {
    reason: string;
}

export interface CreateGymPersonalSessionRequest {
    branchId: UUID;
    trainerId: UUID;
    memberId: UUID;
    startsAt: IsoDateTime;
    durationMinutes?: number;
    roomId?: Nullable<UUID>;
}

export interface CreateGymBookingRequest {
    memberId: UUID;
}

export interface SetGymAttendanceRequest {
    status: GymBookingStatus.ATTENDED | GymBookingStatus.NO_SHOW;
}

/** A free time with a trainer. */
export interface GymPersonalSlot {
    trainerId: UUID;
    startsAt: IsoDateTime;
    endsAt: IsoDateTime;
}
