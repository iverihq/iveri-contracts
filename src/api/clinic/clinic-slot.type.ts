import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';

/** A time one specialist can start this treatment, with a room and any machine free for all of it. */
export interface ClinicSlot {
    staffMemberId: UUID;
    startsAt: IsoDateTime;
    /** When the treatment itself finishes, without the buffer after it. */
    endsAt: IsoDateTime;
}
