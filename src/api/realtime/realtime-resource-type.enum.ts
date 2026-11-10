/**
 * Resource classes the shared realtime gateway can address.
 *
 * Closed by design. A publisher cannot invent a room namespace, and the gateway can map every
 * resource type to the one owning service allowed to issue subscription grants for it.
 */
export enum RealtimeResourceType {
    TAXI_RIDE = 'taxi.ride',
    DELIVERY_JOB = 'delivery.job',
    MOBILITY_WORKER = 'mobility.worker',
    MOBILITY_DISPATCH = 'mobility.dispatch',
    RESTAURANT_BRANCH = 'restaurant.branch',
    RESTAURANT_ORDER = 'restaurant.order',

    /**
     * One Ezo member's own room. They subscribe to themselves, the one thing they can name before a
     * message or a like has happened, and the events on it say what became stale.
     */
    SOCIAL_MEMBER = 'social.member',
    GYM_BRANCH = 'gym.branch',
}
