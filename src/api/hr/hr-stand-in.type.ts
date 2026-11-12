import type { UUID } from '../../type/uuid.type.js';

/**
 * A colleague who, while somebody is away, decides what that person would have: the time off and the expense claims of
 * their reports and of the teams they lead. It covers whole days, both ends included.
 */
export interface HrStandIn {
    id: UUID;
    /** Who is away. */
    employeeId: UUID;
    employeeName: string;
    standInEmployeeId: UUID;
    standInName: string;
    startDate: string;
    endDate: string;
    /** Today, in the company's time zone, falls inside the dates. */
    isActive: boolean;
}

/** Who stands in for me, and for whom I stand in, from today on. HR's list is the same shape, for everybody. */
export interface HrMyStandIns {
    mine: HrStandIn[];
    forOthers: HrStandIn[];
}

export interface HrSaveStandInRequest {
    standInEmployeeId: UUID;
    startDate: string;
    endDate: string;
}
