import { UserPermission } from '../../enum/user-permission.enum.js';

import { MobilityAssignmentStatus } from './mobility-assignment-status.enum.js';
import { MobilityAvailabilityStatus } from './mobility-availability-status.enum.js';
import { MobilityDispatchOfferStatus } from './mobility-dispatch-offer-status.enum.js';
import { MobilityDispatchStatus } from './mobility-dispatch-status.enum.js';
import type { CreateMobilityDispatchBody, MobilityDispatch } from './mobility-dispatch.type.js';
import { MobilityServiceType } from './mobility-service-type.enum.js';
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
});
