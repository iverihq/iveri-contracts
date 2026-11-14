import { describe, expect, it } from 'vitest';

import {
    CHAT_APP_MAX_ACTIVE_SECRETS,
    CHAT_APP_MAX_WEBHOOKS,
    CHAT_WEBHOOK_SECRET_PREFIX,
    CHAT_WEBHOOK_SIGNATURE_HEADER,
    ChatPushCredentialKind,
    ChatPushTokenKind,
    ChatWebhookDeliveryStatus,
    ChatWebhookEvent,
    type ChatAppConversationSummary,
    CHAT_APP_SECRET_PREFIX,
    CHAT_APP_TOKEN_MAX_TTL_SECONDS,
    CHAT_HANDLE_PATTERN,
    CHAT_SOCKET_TICKET_TYPE,
    ChatAppConversationMode,
    CHAT_QUICK_REACTIONS,
    ChatCallEndReason,
    ChatCallKind,
    ChatCallParticipantState,
    ChatCallStatus,
    ChatCaseDecision,
    ChatConversationKind,
    ChatMessageKind,
    ChatParticipantStatus,
    ChatRealtimeEvent,
    ChatReportReason,
    ChatReportTarget,
    ChatRefusal,
    ChatUsageMetric,
    type ChatCall,
    type ChatLastMessagePreview,
    type OpenServerChatRequest,
    type EmbeddedChatParticipant,
} from './index.js';

describe('chat contract', () => {
    it('meters an app under the names its plan limits', () => {
        // Billing stores usage and a plan names its limits by these strings; renaming one makes every stored month and
        // every limit read as a metric nobody reports.
        expect(Object.values(ChatUsageMetric)).toEqual([
            'chat.monthly-active-users',
            'chat.messages',
            'chat.stored-bytes',
        ]);
        expect(ChatRefusal.USAGE_LIMIT).toBe('usage-limit-reached');
    });

    it('keeps the events a webhook can carry, under the names customers subscribe to', () => {
        // A customer's server switches on these strings; renaming one silently drops their events.
        expect(Object.values(ChatWebhookEvent)).toEqual(['message.created', 'report.created', 'person.sanctioned']);
        expect(CHAT_WEBHOOK_SIGNATURE_HEADER).toBe('Baasi-Signature');
        expect(CHAT_WEBHOOK_SECRET_PREFIX).toBe('bwh_');
        expect(CHAT_APP_MAX_WEBHOOKS).toBe(5);
    });

    it('keeps the delivery states in step with the queue they are read from', () => {
        expect(Object.values(ChatWebhookDeliveryStatus)).toEqual([
            'pending',
            'in-flight',
            'delivered',
            'dead-lettered',
            'cancelled',
        ]);
    });

    it('keeps expo the first token kind, and the two credentials an app can bring', () => {
        expect(Object.values(ChatPushTokenKind)).toEqual(['expo', 'apns', 'fcm']);
        expect(Object.values(ChatPushCredentialKind)).toEqual(['apns', 'fcm']);
    });

    it('lists a conversation to a console with no message text', () => {
        // A console reads a conversation only through a report, so the summary has nowhere to put what was said.
        const summary: Required<ChatAppConversationSummary> = {
            id: '00000000-0000-4000-8000-000000000000',
            kind: ChatConversationKind.DIRECT,
            title: null,
            context: null,
            participants: [],
            lastActivityAt: '2026-11-12T10:00:00.000Z',
            closedAt: null,
            createdAt: '2026-11-12T10:00:00.000Z',
        };
        expect(Object.keys(summary).sort()).toEqual([
            'closedAt',
            'context',
            'createdAt',
            'id',
            'kind',
            'lastActivityAt',
            'participants',
            'title',
        ]);
    });

    it('keeps an app closed to its users starting conversations unless it says otherwise', () => {
        expect(Object.values(ChatAppConversationMode)).toEqual(['server', 'users']);
    });

    it('keeps the numbers an app’s server is built against', () => {
        // A customer's server signs against these; moving one breaks somebody else's production.
        expect(CHAT_APP_SECRET_PREFIX).toBe('bs_');
        expect(CHAT_APP_MAX_ACTIVE_SECRETS).toBe(2);
        expect(CHAT_APP_TOKEN_MAX_TTL_SECONDS).toBe(24 * 60 * 60);
        expect(CHAT_SOCKET_TICKET_TYPE).toBe('chat-socket');
    });

    it('keeps the conversation kinds', () => {
        expect(Object.values(ChatConversationKind)).toEqual(['direct', 'group', 'context']);
    });

    it('keeps the participant statuses', () => {
        expect(Object.values(ChatParticipantStatus)).toEqual(['active', 'request', 'left', 'removed']);
    });

    it('keeps the message kinds', () => {
        expect(Object.values(ChatMessageKind)).toEqual(['text', 'photo', 'file', 'voice', 'system']);
    });

    it('keeps the decisions a moderator has', () => {
        expect(Object.values(ChatCaseDecision)).toEqual(['dismiss', 'remove', 'warn', 'suspend', 'ban']);
    });

    it('keeps the two kinds of thing that can be reported', () => {
        expect(Object.values(ChatReportTarget)).toEqual(['message', 'person']);
    });

    it('carries a notice’s variables on an inbox preview, so the row can say the whole sentence', () => {
        const preview: ChatLastMessagePreview = {
            seq: 1,
            kind: ChatMessageKind.SYSTEM,
            excerpt: null,
            systemKey: 'chat.system.group-created',
            systemVariables: { actor: 'Nino' },
            senderName: null,
            isOwn: false,
            isDeleted: false,
            sentAt: '2026-11-11T10:00:00.000Z',
        };
        expect(preview.systemVariables).toEqual({ actor: 'Nino' });
    });

    it('keeps child safety among the reasons', () => {
        expect(Object.values(ChatReportReason)).toContain('child-safety');
    });

    it('names every realtime event under chat.', () => {
        for (const event of Object.values(ChatRealtimeEvent)) expect(event.startsWith('chat.')).toBe(true);
    });

    it('keeps the call vocabulary the notices and the clients read', () => {
        // Each end reason is a different sentence in the conversation; renaming one leaves old notices unreadable.
        expect(Object.values(ChatCallKind)).toEqual(['voice', 'video']);
        expect(Object.values(ChatCallStatus)).toEqual(['ringing', 'active', 'ended']);
        expect(Object.values(ChatCallEndReason)).toEqual([
            'completed',
            'missed',
            'declined',
            'cancelled',
            'busy',
            'failed',
        ]);
        expect(Object.values(ChatCallParticipantState)).toEqual(['ringing', 'joined', 'declined', 'missed', 'left']);
        expect(ChatRealtimeEvent.CALL_UPDATED).toBe('chat.call.updated');
    });

    it('keeps a call to who, when and how it ended', () => {
        // Baasi keeps none of a call's media, and the shape has nowhere to put any.
        const call: Required<ChatCall> = {
            id: '00000000-0000-4000-8000-000000000000',
            conversationId: '00000000-0000-4000-8000-000000000001',
            kind: ChatCallKind.VOICE,
            status: ChatCallStatus.ENDED,
            endReason: ChatCallEndReason.COMPLETED,
            startedBy: '00000000-0000-4000-8000-000000000002',
            participants: [],
            ringExpiresAt: '2026-11-14T10:00:45.000Z',
            answeredAt: '2026-11-14T10:00:05.000Z',
            endedAt: '2026-11-14T10:04:00.000Z',
            createdAt: '2026-11-14T10:00:00.000Z',
        };
        expect(Object.keys(call).sort()).toEqual([
            'answeredAt',
            'conversationId',
            'createdAt',
            'endReason',
            'endedAt',
            'id',
            'kind',
            'participants',
            'ringExpiresAt',
            'startedBy',
            'status',
        ]);
    });

    it('keeps calls out of what an app’s server can ask for', () => {
        // Calls are not sold to other companies' apps yet; the field must not exist on their request.
        const request: Required<OpenServerChatRequest> = {
            context: { product: 'shop', type: 'order', id: '1' },
            title: 'Order 1',
            subtitle: null,
            participants: [],
            isGroup: false,
            writableUntil: null,
            link: null,
        };
        expect(Object.keys(request)).not.toContain('callable');
    });

    it('offers six quick reactions', () => {
        expect(CHAT_QUICK_REACTIONS).toHaveLength(6);
    });

    it('gives an embedded participant no way to carry a phone number or an email address', () => {
        // The other side never sees either, so the shape a product sends cannot hold one.
        const participant: Required<EmbeddedChatParticipant> = {
            userId: '00000000-0000-4000-8000-000000000000',
            displayName: 'Nino',
            label: 'Passenger',
            avatarUrl: null,
            asRequest: false,
        };
        expect(Object.keys(participant).sort()).toEqual(['asRequest', 'avatarUrl', 'displayName', 'label', 'userId']);
    });

    it.each(['ana', 'ana.k', 'a_b', 'nino2024'])('accepts the handle %s', (handle) => {
        expect(CHAT_HANDLE_PATTERN.test(handle)).toBe(true);
    });

    it.each(['аna', 'ANA', '.ana', 'ana.', 'a na', 'ნინო', 'ab'])('refuses the handle %s', (handle) => {
        expect(CHAT_HANDLE_PATTERN.test(handle)).toBe(false);
    });
});
