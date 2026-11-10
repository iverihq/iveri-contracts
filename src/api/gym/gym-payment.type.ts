import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { GymPaymentKind } from './gym-payment-kind.enum.js';
import type { GymPaymentMethod } from './gym-payment-method.enum.js';

/** One line of the ledger. Lines are only ever added, and a refund points at what it returns. */
export interface GymPayment {
    id: UUID;
    memberId: UUID;
    memberName: string;
    membershipId: UUID;
    membershipName: LocalizedText;
    branchId: Nullable<UUID>;
    kind: GymPaymentKind;
    method: GymPaymentMethod;
    currency: string;
    amountMinor: number;
    /** What has already been given back of this payment. */
    refundedMinor: number;
    refundOfPaymentId: Nullable<UUID>;
    note: Nullable<string>;
    recordedByUserId: Nullable<UUID>;
    createdAt: IsoDateTime;
}

export interface RecordGymPaymentRequest {
    membershipId: UUID;
    branchId: UUID;
    amountMinor: number;
    method: GymPaymentMethod;
    note?: Nullable<string>;
}

export interface RefundGymPaymentRequest {
    amountMinor: number;
    reason: string;
}

export interface GymTakingsLine {
    method: GymPaymentMethod;
    paymentsMinor: number;
    refundsMinor: number;
    netMinor: number;
}

/** One branch's money on one day in its own time zone. */
export interface GymTakingsReport {
    date: string;
    branchId: UUID;
    currency: string;
    lines: GymTakingsLine[];
    totalMinor: number;
}

export interface GymOwingMembership {
    membershipId: UUID;
    memberId: UUID;
    memberName: string;
    phone: Nullable<string>;
    name: LocalizedText;
    owingMinor: number;
    currency: string;
}
