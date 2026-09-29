import { RealtimeEventType } from './realtime-event-type.enum.js';
import { RealtimeResourceType } from './realtime-resource-type.enum.js';
import {
    MAX_REALTIME_EVENT_BYTES,
    MAX_REALTIME_GRANT_TTL_SECONDS,
    REALTIME_GRANT_AUDIENCE,
    REALTIME_GRANT_ISSUER,
} from './realtime.type.js';

describe('shared realtime contract', () => {
    it.each([
        [RealtimeResourceType.TAXI_RIDE, 'taxi.ride'],
        [RealtimeResourceType.DELIVERY_JOB, 'delivery.job'],
        [RealtimeResourceType.MOBILITY_WORKER, 'mobility.worker'],
        [RealtimeResourceType.MOBILITY_DISPATCH, 'mobility.dispatch'],
    ])('pins resource type %s', (member, value) => {
        expect(member).toBe(value);
    });

    it.each([
        [RealtimeEventType.TAXI_RIDE_UPDATED, 'taxi.ride.updated'],
        [RealtimeEventType.DELIVERY_JOB_UPDATED, 'delivery.job.updated'],
        [RealtimeEventType.MOBILITY_WORKER_LOCATION_UPDATED, 'mobility.worker-location.updated'],
        [RealtimeEventType.MOBILITY_ASSIGNMENT_UPDATED, 'mobility.assignment.updated'],
    ])('pins event type %s', (member, value) => {
        expect(member).toBe(value);
    });

    it('keeps grants short-lived and scoped to this gateway', () => {
        expect(MAX_REALTIME_GRANT_TTL_SECONDS).toBe(300);
        expect(REALTIME_GRANT_ISSUER).toBe('iveri-realtime');
        expect(REALTIME_GRANT_AUDIENCE).toBe('iveri-realtime-subscription');
    });

    it('caps events at an identifier-only payload size', () => {
        expect(MAX_REALTIME_EVENT_BYTES).toBe(4096);
    });
});
