import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ChatCaseDecision } from './chat-case-decision.enum.js';
import type { ChatCaseStatus } from './chat-case-status.enum.js';
import type { ChatMessageKind } from './chat-message-kind.enum.js';
import type { ChatPersonStatus } from './chat-person-status.enum.js';
import type { ChatReportReason } from './chat-report-reason.enum.js';
import type { ChatReportTarget } from './chat-report-target.enum.js';

export interface CreateChatReportRequest {
    target: ChatReportTarget;
    /** The message, for a message report. */
    messageId?: UUID;
    /** The person, for a person report. */
    userId?: UUID;
    reason: ChatReportReason;
    note?: Nullable<string>;
}

/** A message as it was when reported. The author may have changed or deleted it since. */
export interface ChatCaseMessage {
    messageId: UUID;
    seq: number;
    senderUserId: Nullable<UUID>;
    senderName: Nullable<string>;
    kind: ChatMessageKind;
    body: Nullable<string>;
    attachmentCount: number;
    sentAt: IsoDateTime;
    /** The reported one, as against the five before it. */
    isReported: boolean;
}

export interface ChatCaseAction {
    decision: ChatCaseDecision;
    note: string;
    decidedByUserId: UUID;
    decidedAt: IsoDateTime;
    suspendedUntil: Nullable<IsoDateTime>;
}

export interface ChatCaseSummary {
    id: UUID;
    status: ChatCaseStatus;
    target: ChatReportTarget;
    /** The most reported reason. */
    reason: ChatReportReason;
    reportCount: number;
    reportedUserId: UUID;
    reportedName: string;
    /** Set for an embedded conversation, so staff know which product it came from. */
    product: Nullable<string>;
    /** Child safety goes to the top. */
    priority: number;
    claimedByUserId: Nullable<UUID>;
    claimedUntil: Nullable<IsoDateTime>;
    openedAt: IsoDateTime;
}

export interface ChatCase extends ChatCaseSummary {
    reasons: { reason: ChatReportReason; count: number }[];
    notes: string[];
    /** Empty for a person report. Reading this is written to the access log. */
    messages: ChatCaseMessage[];
    actions: ChatCaseAction[];
    reportedPersonStatus: ChatPersonStatus;
    reportedPersonPriorActions: number;
}

export interface DecideChatCaseRequest {
    decision: ChatCaseDecision;
    /** Shown to the person in their language when they read why. */
    note: string;
    /** Required for a suspension. */
    suspendedUntil?: Nullable<IsoDateTime>;
}

export interface ChatStaffPerson {
    userId: UUID;
    tenantId: UUID;
    /** The id an outside app knows this person by. Null for everybody signed in through Iveri. */
    externalId: Nullable<string>;
    handle: Nullable<string>;
    displayName: Nullable<string>;
    status: ChatPersonStatus;
    suspendedUntil: Nullable<IsoDateTime>;
    conversationCount: number;
    reportCount: number;
    actionCount: number;
    createdAt: IsoDateTime;
    lastActiveAt: Nullable<IsoDateTime>;
}

export interface ChatStaffAccessEntry {
    id: UUID;
    staffUserId: UUID;
    caseId: Nullable<UUID>;
    action: string;
    occurredAt: IsoDateTime;
}

export interface ChatStaffOverview {
    people: number;
    newPeopleThisWeek: number;
    conversations: number;
    messagesToday: number;
    openCases: number;
    childSafetyCases: number;
    embeddedConversations: { product: string; open: number; closed: number }[];
}
