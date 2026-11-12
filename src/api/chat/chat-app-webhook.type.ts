import type { CursorPage } from '../../type/cursor-page.type.js';
import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ChatAttachmentKind } from './chat-attachment-kind.enum.js';
import type { ChatCaseDecision } from './chat-case-decision.enum.js';
import type { ChatMessageKind } from './chat-message-kind.enum.js';
import type { ChatReportReason } from './chat-report-reason.enum.js';
import type { ChatReportTarget } from './chat-report-target.enum.js';
import type { ChatWebhookDeliveryStatus } from './chat-webhook-delivery-status.enum.js';
import type { ChatWebhookEvent } from './chat-webhook-event.enum.js';

/** An address an app's server listens at, and what it wants to hear about. */
export interface ChatAppWebhook {
    id: UUID;
    appId: UUID;
    /** `https://`, or `http://` only where the deployment allows private addresses. */
    url: string;
    events: ChatWebhookEvent[];
    isActive: boolean;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/** `POST /apps/:appId/webhooks`. */
export interface CreateChatAppWebhookRequest {
    url: string;
    /** At least one. */
    events: ChatWebhookEvent[];
    /** Omitted means active. */
    isActive?: boolean;
}

/** `PATCH /apps/:appId/webhooks/:webhookId`. The address is fixed: a new address is a new webhook. */
export interface UpdateChatAppWebhookRequest {
    events?: ChatWebhookEvent[];
    isActive?: boolean;
}

/**
 * `POST /apps/:appId/webhooks` and `POST …/rotate-secret`. The only answers that hold the signing secret: Baasi does
 * not keep it, and after a rotation the old one stops signing at once.
 */
export interface CreatedChatAppWebhook extends ChatAppWebhook {
    /** `bwh_` and 32 random bytes in base64url. The HMAC key for `Baasi-Signature`. */
    signingSecret: string;
}

/** One attempt by Baasi to tell an app's server something, read from the delivery queue. */
export interface ChatAppWebhookDelivery {
    id: UUID;
    /** The event's own id, which is also the `id` of the body the server received. */
    eventId: Nullable<string>;
    status: ChatWebhookDeliveryStatus;
    attemptCount: number;
    maxAttempts: number;
    nextAttemptAt: IsoDateTime;
    lastAttemptAt: Nullable<IsoDateTime>;
    /** What the app's server answered last. Null when nothing answered. */
    lastResponseStatus: Nullable<number>;
    lastError: Nullable<string>;
    completedAt: Nullable<IsoDateTime>;
    createdAt: IsoDateTime;
}

/** `GET /apps/:appId/webhooks/:webhookId/deliveries`. Newest first. */
export type ChatAppWebhookDeliveriesPage = CursorPage<ChatAppWebhookDelivery>;

/**
 * The body every webhook carries, signed with `Baasi-Signature: t=<unix seconds>,v1=<hex HMAC-SHA256 of
 * "<t>.<body>">`. Users are named by the app's own ids for them. `id` is stable across retries, so a server that has
 * seen it may answer 200 and do nothing.
 */
export interface ChatWebhookPayload<TType extends ChatWebhookEvent = ChatWebhookEvent, TData = unknown> {
    id: UUID;
    type: TType;
    appId: UUID;
    createdAt: IsoDateTime;
    data: TData;
}

/** A conversation's product context, when the app's server opened it about something. */
export interface ChatWebhookConversationContext {
    product: string;
    type: string;
    id: string;
}

/** `message.created`. The text is the app's own data on its way to its own server. */
export interface ChatWebhookMessageCreatedData {
    conversationId: UUID;
    context: Nullable<ChatWebhookConversationContext>;
    messageId: UUID;
    seq: number;
    /** The app's own id for whoever wrote it. */
    senderExternalId: Nullable<string>;
    kind: ChatMessageKind;
    text: Nullable<string>;
    attachmentKinds: ChatAttachmentKind[];
}

/** `report.created`. The reporter is not named: a report is the reporter's own and staff decide it. */
export interface ChatWebhookReportCreatedData {
    caseId: UUID;
    target: ChatReportTarget;
    reason: ChatReportReason;
    reportedExternalId: Nullable<string>;
    conversationId: Nullable<UUID>;
    messageId: Nullable<UUID>;
}

/** `person.sanctioned`. The moderator's note stays in the record. */
export interface ChatWebhookPersonSanctionedData {
    externalId: Nullable<string>;
    decision: ChatCaseDecision;
    suspendedUntil: Nullable<IsoDateTime>;
    caseId: Nullable<UUID>;
}

export type ChatWebhookMessageCreated = ChatWebhookPayload<
    ChatWebhookEvent.MESSAGE_CREATED,
    ChatWebhookMessageCreatedData
>;
export type ChatWebhookReportCreated = ChatWebhookPayload<
    ChatWebhookEvent.REPORT_CREATED,
    ChatWebhookReportCreatedData
>;
export type ChatWebhookPersonSanctioned = ChatWebhookPayload<
    ChatWebhookEvent.PERSON_SANCTIONED,
    ChatWebhookPersonSanctionedData
>;
