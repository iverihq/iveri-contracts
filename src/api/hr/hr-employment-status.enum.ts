/**
 * Where somebody is in their employment, worked out from their dates on every read.
 *
 * Never stored: a column would need a sweep to stay true, and would be wrong whenever the sweep was late.
 */
export enum HrEmploymentStatus {
    /** Their first day is still to come. */
    UPCOMING = 'upcoming',
    ACTIVE = 'active',
    /** A last day is set and has not passed. */
    LEAVING = 'leaving',
    FORMER = 'former',
}
