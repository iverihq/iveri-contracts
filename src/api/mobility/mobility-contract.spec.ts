import { ALL_USER_PERMISSIONS, UserPermission } from '../../enum/user-permission.enum.js';

import { MobilityAssignmentStatus } from './mobility-assignment-status.enum.js';
import { MobilityAvailabilityStatus } from './mobility-availability-status.enum.js';
import { MobilityDispatchOfferStatus } from './mobility-dispatch-offer-status.enum.js';
import { MobilityDispatchStatus } from './mobility-dispatch-status.enum.js';
import type { CreateMobilityDispatchBody, MobilityDispatch } from './mobility-dispatch.type.js';
import { MobilityServiceType } from './mobility-service-type.enum.js';
import type { MobilityWorkerRating, MobilityWorkerReputation } from './mobility-worker-rating.type.js';
import { MobilityWorkerStatus } from './mobility-worker-status.enum.js';

describe('mobility contracts', () => {
    it('requires a pickup to create a dispatch and allows a redacted one to be read', () => {
        // A type-level assertion, written as a value so it runs: a dispatch cannot be *created*
        // without a pickup, while one read back may have had it redacted past Mobility's location
        // retention window. Collapsing the two into one shape is the tidy-up that would either
        // let a caller submit a dispatch with nowhere to search from, or make every reader of a
        // live dispatch handle a null that cannot occur.
        const created: CreateMobilityDispatchBody = {
            serviceType: MobilityServiceType.TAXI,
            subjectId: '11111111-1111-4111-8111-111111111111',
            pickupLatitude: 41.7151,
            pickupLongitude: 44.8271,
        };
        const redacted: Pick<MobilityDispatch, 'pickupLatitude' | 'pickupLongitude'> = {
            pickupLatitude: null,
            pickupLongitude: null,
        };

        expect(created.pickupLatitude).toBe(41.7151);
        expect(redacted.pickupLatitude).toBeNull();
        expect(redacted.pickupLongitude).toBeNull();
    });

    it('keeps service types closed', () => {
        expect(Object.values(MobilityServiceType)).toEqual(['taxi', 'delivery']);
    });

    it('keeps administrative status separate from availability', () => {
        expect(Object.values(MobilityWorkerStatus)).toEqual(['active', 'suspended']);
        expect(Object.values(MobilityAvailabilityStatus)).toEqual(['offline', 'available', 'busy']);
    });

    it('reserves distinct permissions for reading and writing raw worker location', () => {
        expect(UserPermission.MOBILITY_WORKER_LOCATION_READ).toBe('mobility:worker:location:read');
        expect(UserPermission.MOBILITY_WORKER_LOCATION_UPDATE).toBe('mobility:worker:location:update');
    });

    it('keeps dispatch lifecycle closed and separates submission from operation', () => {
        expect(Object.values(MobilityDispatchStatus)).toEqual([
            'pending',
            'searching',
            'offered',
            'assigned',
            'expired',
            'cancelled',
            'failed',
        ]);
        expect(UserPermission.MOBILITY_DISPATCH_CREATE).toBe('mobility:dispatch:create');
        expect(UserPermission.MOBILITY_DISPATCH_OPERATE).toBe('mobility:dispatch:operate');
    });

    it('keeps offer and assignment lifecycles closed', () => {
        expect(Object.values(MobilityDispatchOfferStatus)).toEqual([
            'pending',
            'accepted',
            'rejected',
            'expired',
            'superseded',
        ]);
        expect(Object.values(MobilityAssignmentStatus)).toEqual(['active', 'released']);
    });

    it('gives workers least-privilege offer access without dispatch operation', () => {
        expect(UserPermission.MOBILITY_DISPATCH_OFFER_READ).toBe('mobility:dispatch-offer:read');
        expect(UserPermission.MOBILITY_DISPATCH_OFFER_RESPOND).toBe('mobility:dispatch-offer:respond');
    });

    it('separates submitting a rating from managing a worker', () => {
        // A product API records what a customer thought of one job. An administrator changes
        // somebody's capabilities and whether they may work at all. Folding the first into the
        // second would mean a service that only ever writes a score could also suspend people.
        expect(UserPermission.MOBILITY_WORKER_RATING_SUBMIT).toBe('mobility:worker:rating:submit');
        expect(UserPermission.MOBILITY_WORKER_RATING_SUBMIT).not.toBe(UserPermission.MOBILITY_WORKER_MANAGE);
    });

    it('publishes no permission for reading a rating, because the worker read already carries it', () => {
        // `ratingAverage` and `ratingCount` are fields on `MobilityWorker`, so a caller holding
        // `mobility:worker:read` has them. A `mobility:worker:rating:read` would be a second
        // grant over two columns of a row the first one already returns — and the day somebody
        // adds one, this assertion is where they have to say why.
        expect(ALL_USER_PERMISSIONS).not.toContain('mobility:worker:rating:read');
    });

    it('withholds the average and not the count, so "new" is distinguishable from "bad"', () => {
        // The honest shape of "not enough ratings to say": a worker whose first customer gave
        // them one star is not a one-star worker. A zero there, or an average computed from one
        // score, makes one bad day permanent — so the field is nullable and the count is not.
        const unrated: MobilityWorkerReputation = { ratingAverage: null, ratingCount: 1 };
        const rated: MobilityWorkerReputation = { ratingAverage: 4.8, ratingCount: 42 };

        expect(unrated.ratingAverage).toBeNull();
        expect(unrated.ratingCount).toBe(1);
        expect(rated.ratingAverage).toBe(4.8);
    });

    it('carries no comment on a rating, and no rater on what is published', () => {
        const rating: MobilityWorkerRating = {
            id: '00000000-0000-4000-8000-000000000001',
            assignmentId: '00000000-0000-4000-8000-000000000002',
            workerId: '00000000-0000-4000-8000-000000000003',
            score: 5,
            createdAt: '2026-10-30T00:00:00.000Z',
        };

        // Free text about a named person needs a reader, a way to contest it and a retention
        // window; a score needs none of those. And `ratedByUserId` is on the submit body only —
        // a worker learning which customer scored them one star is how a rating becomes a
        // reprisal.
        expect(Object.keys(rating).sort()).toEqual(['assignmentId', 'createdAt', 'id', 'score', 'workerId']);
    });
});
