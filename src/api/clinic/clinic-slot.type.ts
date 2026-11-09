import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { LocalizedText } from './localized-text.type.js';

/** A time one specialist can start this treatment, with a room and any machine free for all of it. */
export interface ClinicSlot {
    staffMemberId: UUID;
    startsAt: IsoDateTime;
    /** When the treatment itself finishes, without the buffer after it. */
    endsAt: IsoDateTime;
    /** What this visit would cost at this time, after any promotion. */
    totalMinor: number;
    /** How much a promotion takes off. Zero when none applies. */
    discountMinor: number;
    promotionName: Nullable<LocalizedText>;
}
