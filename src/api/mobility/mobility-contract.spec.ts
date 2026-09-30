import { UserPermission } from '../../enum/user-permission.enum.js';

import { MobilityAssignmentStatus } from './mobility-assignment-status.enum.js';
import { MobilityAvailabilityStatus } from './mobility-availability-status.enum.js';
import { MobilityDispatchOfferStatus } from './mobility-dispatch-offer-status.enum.js';
import { MobilityDispatchStatus } from './mobility-dispatch-status.enum.js';
import { MobilityServiceType } from './mobility-service-type.enum.js';
import { MobilityWorkerStatus } from './mobility-worker-status.enum.js';

describe('mobility contracts', () => {
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
