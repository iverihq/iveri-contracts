/**
 * Where a membership stands today.
 *
 * Only awaiting payment, active and cancelled are decisions anybody made. Upcoming, frozen and
 * expired are read from its dates in the gym's own time zone, at the moment somebody asks.
 */
export enum GymMembershipStatus {
    AWAITING_PAYMENT = 'awaiting-payment',
    UPCOMING = 'upcoming',
    ACTIVE = 'active',
    FROZEN = 'frozen',
    EXPIRED = 'expired',
    CANCELLED = 'cancelled',
}
