import { describe, expect, it } from 'vitest';

import {
    CHAT_HANDLE_PATTERN,
    CHAT_QUICK_REACTIONS,
    ChatCaseDecision,
    ChatConversationKind,
    ChatMessageKind,
    ChatParticipantStatus,
    ChatRealtimeEvent,
    ChatReportReason,
    ChatReportTarget,
    type EmbeddedChatParticipant,
} from './index.js';

describe('chat contract', () => {
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

    it('keeps child safety among the reasons', () => {
        expect(Object.values(ChatReportReason)).toContain('child-safety');
    });

    it('names every realtime event under chat.', () => {
        for (const event of Object.values(ChatRealtimeEvent)) expect(event.startsWith('chat.')).toBe(true);
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
