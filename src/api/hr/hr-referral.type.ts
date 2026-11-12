import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrReferralOutcome } from './hr-referral-outcome.enum.js';

/** Somebody the signed-in person put forward, as they are allowed to see it. */
export interface HrMyReferral {
    id: UUID;
    openingId: UUID;
    openingTitle: string;
    /** Null once the company's retention window has removed the person's details. */
    candidateName: Nullable<string>;
    outcome: HrReferralOutcome;
    referredAt: IsoDateTime;
}

/**
 * Putting somebody forward for an open role. Sent as a form, so a CV can come with it.
 *
 * `candidateAgreed` is the referrer saying the person agreed to be put forward, which is what lets their details
 * be kept; it is sent as the string `true`.
 */
export interface CreateHrReferralRequest {
    openingId: UUID;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    note?: string;
    candidateAgreed: string;
}
