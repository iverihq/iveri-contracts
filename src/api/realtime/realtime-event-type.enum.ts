/**
 * Identifier-only change notifications delivered over the shared gateway.
 *
 * These are prompts to refetch from an owning API, never domain state. Keeping the set closed
 * prevents a typo from becoming a silently ignored update or forcing clients to refetch every
 * resource for an event they do not understand.
 */
export enum RealtimeEventType {
    TAXI_RIDE_UPDATED = 'taxi.ride.updated',
    DELIVERY_JOB_UPDATED = 'delivery.job.updated',
    MOBILITY_WORKER_UPDATED = 'mobility.worker.updated',
    MOBILITY_WORKER_LOCATION_UPDATED = 'mobility.worker-location.updated',
    MOBILITY_ASSIGNMENT_UPDATED = 'mobility.assignment.updated',

    /**
     * An offer addressed to a worker changed, so their own offer list is stale.
     *
     * Carried on the **`mobility.worker` resource**, not an offer resource, and that is the whole
     * point: a worker cannot subscribe to an offer that does not exist yet, and discovering new
     * work is exactly the case realtime has to serve. They subscribe to themselves — the one
     * identifier they hold before any offer is made — and refetch their self-scoped offer list.
     *
     * The event therefore names one resource while describing another aggregate, so its version
     * must be the **offer's**, never the worker's. Publishing the worker's version here would
     * repeat a value the profile events already used and be silently discarded by the outbox's
     * uniqueness constraint. `mobility_worker_outbox_event.aggregate_type` exists for this.
     */
    MOBILITY_DISPATCH_OFFER_UPDATED = 'mobility.dispatch-offer.updated',

    /**
     * Something on a branch's floor or kitchen changed, so staff screens refetch. Carried on the
     * branch, while the version is that of whichever order or bill moved.
     */
    RESTAURANT_BRANCH_UPDATED = 'restaurant.branch.updated',

    /** One diner's order moved. */
    RESTAURANT_ORDER_UPDATED = 'restaurant.order.updated',

    /** Something new happened to a member, so their activity list and its count are stale. */
    SOCIAL_ACTIVITY_UPDATED = 'social.activity.updated',
    /** Somebody came through a branch's door or a class changed, so staff screens refetch. */
    GYM_BRANCH_UPDATED = 'gym.branch.updated',

    /**
     * Something a member or a trainer reads about themselves changed, such as the conversation with
     * the person they train with opening, so their bookings or sessions refetch. Carried on the
     * person, while the version is that of whatever moved.
     */
    GYM_PERSON_UPDATED = 'gym.person.updated',

    /**
     * A visit at a clinic's branch was booked, moved, changed status, had its deposit settle or release it, or had
     * money recorded against it, so reception's calendar for that branch refetches. Carried on the branch (the clinic
     * calls it a location), while the version is that of whatever moved.
     */
    CLINIC_LOCATION_UPDATED = 'clinic.location.updated',
}
