import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrTeamRole } from './hr-team-role.enum.js';

export interface HrCoverageRule {
    jobTitleId: UUID;
    jobTitleName: string;
    maxAway: number;
}

export interface HrEmployeeTeam {
    teamId: UUID;
    teamName: string;
    role: HrTeamRole;
}

export interface HrMyTeam {
    id: UUID;
    name: string;
    description: Nullable<string>;
    myRole: HrTeamRole;
    members: HrTeamMembership[];
}

export interface HrTeamDetail {
    team: HrTeam;
    members: HrTeamMembership[];
    coverageRules: HrCoverageRule[];
}

export interface HrTeamMembership {
    employeeId: UUID;
    name: string;
    jobTitleId: Nullable<UUID>;
    jobTitleName: Nullable<string>;
    role: HrTeamRole;
}

export interface HrTeam {
    id: UUID;
    name: string;
    description: Nullable<string>;
    memberCount: number;
    leadNames: string[];
    createdAt: IsoDateTime;
}

export interface HrPutCoverageRuleRequest {
    maxAway: number;
}

export interface HrPutTeamMemberRequest {
    role: HrTeamRole;
}

export interface HrSaveTeamRequest {
    name: string;
    description?: string;
}

export interface UpdateHrTeamRequest {
    name?: string;
    description?: string | null;
}
