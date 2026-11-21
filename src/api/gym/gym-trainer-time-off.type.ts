import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { GymSessionKind } from './gym-session-kind.enum.js';

/**
 * A session the trainer still holds inside their time off: a class that needs somebody to cover it, or a personal
 * session to move. Recording time off never cancels anything by itself.
 */
export interface GymTrainerTimeOffSession {
    id: UUID;
    kind: GymSessionKind;
    branchId: UUID;
    /** The class's name, or null for personal training. */
    className: Nullable<LocalizedText>;
    startsAt: IsoDateTime;
    endsAt: IsoDateTime;
    bookedCount: number;
}

/** A stretch of time a trainer is away. Nobody can book them for personal training inside it. */
export interface GymTrainerTimeOff {
    id: UUID;
    trainerId: UUID;
    trainerName: string;
    startsAt: IsoDateTime;
    endsAt: IsoDateTime;
    note: Nullable<string>;
    sessionsToCover: GymTrainerTimeOffSession[];
    createdAt: IsoDateTime;
}

/** Recording time off. A trainer may record their own; anybody else's needs `gym:schedule:manage`. */
export interface CreateGymTrainerTimeOffRequest {
    trainerId: UUID;
    startsAt: IsoDateTime;
    endsAt: IsoDateTime;
    note?: Nullable<string>;
}

/** Which time off to list: whatever overlaps `from` to `to`, for one trainer or for everybody. */
export interface ListGymTrainerTimeOffQuery {
    from: IsoDateTime;
    to: IsoDateTime;
    trainerId?: UUID;
}
