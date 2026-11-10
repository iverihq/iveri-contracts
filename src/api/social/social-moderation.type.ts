import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { SocialAppealStatus } from './social-appeal-status.enum.js';
import type { SocialCaseDecision } from './social-case-decision.enum.js';
import type { SocialCaseStatus } from './social-case-status.enum.js';
import type { SocialMemberStatus } from './social-member-status.enum.js';
import type { SocialMemberCard } from './social-member.type.js';
import type { SocialModerationReason } from './social-moderation-reason.enum.js';
import type { SocialReportReason } from './social-report-reason.enum.js';
import type { SocialReportTarget } from './social-report-target.enum.js';

export interface CreateSocialReportRequest {
    targetType: SocialReportTarget;
    targetId: UUID;
    reason: SocialReportReason;
    detail?: Nullable<string>;
}

/** A decision, as the member it was about reads it. */
export interface SocialNotice {
    id: UUID;
    decision: SocialCaseDecision;
    reason: SocialModerationReason;
    targetType: SocialReportTarget;
    excerpt: Nullable<string>;
    decidedAt: IsoDateTime;
    suspendedUntil: Nullable<IsoDateTime>;
    canAppeal: boolean;
    appealStatus: Nullable<SocialAppealStatus>;
    appealAnsweredAt: Nullable<IsoDateTime>;
}

export interface CreateSocialAppealRequest {
    statement: string;
}

/** What was reported, frozen when the case opened. */
export interface SocialCaseEvidence {
    text: Nullable<string>;
    imageUrls: string[];
    /** For a reported message, what came just before it, oldest first. */
    context: SocialCaseMessageContext[];
    createdAt: Nullable<IsoDateTime>;
}

export interface SocialCaseMessageContext {
    senderHandle: Nullable<string>;
    body: Nullable<string>;
    sentAt: IsoDateTime;
}

export interface SocialCaseSummary {
    id: UUID;
    targetType: SocialReportTarget;
    targetId: UUID;
    status: SocialCaseStatus;
    subject: Nullable<SocialMemberCard>;
    excerpt: Nullable<string>;
    topReason: SocialReportReason;
    reportCount: number;
    isUrgent: boolean;
    claimedByMe: boolean;
    claimedUntil: Nullable<IsoDateTime>;
    openedAt: IsoDateTime;
    lastReportedAt: IsoDateTime;
    decision: Nullable<SocialCaseDecision>;
}

export interface SocialCaseReport {
    id: UUID;
    reporter: Nullable<SocialMemberCard>;
    reason: SocialReportReason;
    detail: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface SocialCaseAction {
    id: UUID;
    decision: SocialCaseDecision;
    reason: SocialModerationReason;
    note: Nullable<string>;
    moderatorUserId: UUID;
    suspendedUntil: Nullable<IsoDateTime>;
    createdAt: IsoDateTime;
}

export interface SocialCaseDetail extends SocialCaseSummary {
    evidence: SocialCaseEvidence;
    reports: SocialCaseReport[];
    actions: SocialCaseAction[];
    subjectRecord: Nullable<SocialStaffMember>;
}

export interface DecideSocialCaseRequest {
    decision: SocialCaseDecision;
    reason: SocialModerationReason;
    /** Staff only. The member is told the reason, never this. */
    note?: Nullable<string>;
    suspendDays?: Nullable<number>;
}

/** A member as staff see them. */
export interface SocialStaffMember extends SocialMemberCard {
    status: SocialMemberStatus;
    suspendedUntil: Nullable<IsoDateTime>;
    isMinor: boolean;
    bio: Nullable<string>;
    followerCount: number;
    followingCount: number;
    postCount: number;
    warningCount: number;
    suspensionCount: number;
    reportCount: number;
    joinedAt: IsoDateTime;
}

export interface SocialStaffMemberDetail extends SocialStaffMember {
    notices: SocialStaffNotice[];
}

export interface SocialStaffNotice extends SocialNotice {
    caseId: UUID;
    moderatorUserId: UUID;
    note: Nullable<string>;
}

export interface SanctionSocialMemberRequest {
    decision: SocialCaseDecision.SUSPEND | SocialCaseDecision.BAN;
    reason: SocialModerationReason;
    note?: Nullable<string>;
    suspendDays?: Nullable<number>;
}

export interface SocialStaffAppeal {
    id: UUID;
    status: SocialAppealStatus;
    statement: string;
    member: Nullable<SocialMemberCard>;
    notice: SocialStaffNotice;
    /** The moderator who made the decision cannot answer this appeal. */
    canDecide: boolean;
    createdAt: IsoDateTime;
    answeredAt: Nullable<IsoDateTime>;
    answerNote: Nullable<string>;
}

export interface DecideSocialAppealRequest {
    status: SocialAppealStatus.UPHELD | SocialAppealStatus.REVERSED;
    note?: Nullable<string>;
}

export interface SocialModerationOverview {
    openCases: number;
    urgentCases: number;
    pendingAppeals: number;
    oldestOpenAt: Nullable<IsoDateTime>;
    resolvedLast7Days: number;
    reportsLast7Days: number;
    membersTotal: number;
    membersLast7Days: number;
    postsLast7Days: number;
    restrictedMembers: number;
    reportsByReason: SocialReasonCount[];
    reportsByDay: SocialDayCount[];
}

export interface SocialReasonCount {
    reason: SocialReportReason;
    count: number;
}

export interface SocialDayCount {
    day: string;
    count: number;
}

/** One line of the record of what staff looked at and did. */
export interface SocialStaffAuditEntry {
    id: UUID;
    staffUserId: UUID;
    action: string;
    caseId: Nullable<UUID>;
    memberId: Nullable<UUID>;
    createdAt: IsoDateTime;
}
