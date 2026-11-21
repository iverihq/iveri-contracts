import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ClinicDepositStatus } from './clinic-deposit-status.enum.js';

/**
 * The deposit on one of a client's own visits, and where to pay it.
 *
 * `checkoutUrl` is the bank's hosted page, present only while the deposit is still `pending`. Coming
 * back from that page proves nothing: a client's app reads this again, and the clinic asks the bank.
 */
export interface MyClinicDeposit {
    appointmentId: UUID;
    depositStatus: ClinicDepositStatus;
    depositMinor: number;
    currency: string;
    checkoutUrl: Nullable<string>;
    depositExpiresAt: Nullable<IsoDateTime>;
    depositPaidAt: Nullable<IsoDateTime>;
}
