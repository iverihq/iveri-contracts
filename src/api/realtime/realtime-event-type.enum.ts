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
    MOBILITY_WORKER_LOCATION_UPDATED = 'mobility.worker-location.updated',
    MOBILITY_ASSIGNMENT_UPDATED = 'mobility.assignment.updated',
}
