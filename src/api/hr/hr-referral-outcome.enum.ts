/**
 * What somebody who put a colleague forward is told about it.
 *
 * Deliberately coarser than the application's stage: the person who referred them is not part of the hiring, so
 * they learn that it is still going, that the person was hired, or that it has ended, and never why.
 */
export enum HrReferralOutcome {
    IN_PROGRESS = 'in-progress',
    HIRED = 'hired',
    CLOSED = 'closed',
}
