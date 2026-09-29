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
}
