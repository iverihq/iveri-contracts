import { UserPermission } from '../../enum/user-permission.enum.js';

import { MobilityAvailabilityStatus } from './mobility-availability-status.enum.js';
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
});
