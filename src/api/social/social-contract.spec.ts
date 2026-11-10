import { describe, expect, it } from 'vitest';

import {
    SOCIAL_HANDLE_PATTERN,
    SocialActivityKind,
    SocialCaseDecision,
    SocialFollowState,
    SocialMemberStatus,
    SocialModerationReason,
    SocialReportReason,
    SocialReportTarget,
} from './index.js';

describe('social contract', () => {
    it('keeps the member status wire values', () => {
        expect(Object.values(SocialMemberStatus)).toEqual(['active', 'suspended', 'banned', 'deleting']);
    });

    it('keeps the follow states', () => {
        expect(Object.values(SocialFollowState)).toEqual(['none', 'requested', 'following']);
    });

    it('keeps the kinds of thing that can be reported', () => {
        expect(Object.values(SocialReportTarget)).toEqual(['post', 'comment', 'story', 'member', 'message']);
    });

    it('keeps the decisions a moderator has', () => {
        expect(Object.values(SocialCaseDecision)).toEqual(['dismiss', 'remove', 'warn', 'suspend', 'ban']);
    });

    it('offers a moderator every rule a member can report', () => {
        // A reason a member can pick and a moderator cannot name would have no way to be upheld.
        expect(Object.values(SocialModerationReason).sort()).toEqual(Object.values(SocialReportReason).sort());
    });

    it('keeps a moderation notice in the activity kinds', () => {
        expect(Object.values(SocialActivityKind)).toContain('moderation-notice');
    });

    it.each(['ana', 'ana.k', 'a_b', 'nino2024', 'a1b'])('accepts the handle %s', (handle) => {
        expect(SOCIAL_HANDLE_PATTERN.test(handle)).toBe(true);
    });

    // A Cyrillic letter drawn the same as a Latin one is how a handle impersonates somebody.
    it.each(['аna', 'ANA', '.ana', 'ana.', 'a na', 'ნინო'])('refuses the handle %s', (handle) => {
        expect(SOCIAL_HANDLE_PATTERN.test(handle)).toBe(false);
    });
});
