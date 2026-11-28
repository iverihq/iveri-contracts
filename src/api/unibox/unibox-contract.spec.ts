import { describe, expect, it } from 'vitest';

import { UniboxNoteKind, UniboxRefusal } from './index.js';

describe('unibox contract', () => {
    it('keeps the refusal reasons a client translates', () => {
        expect(Object.values(UniboxRefusal)).toEqual([
            'channel-inactive',
            'status-not-allowed',
            'snooze-in-past',
            'shortcut-taken',
            'team-name-taken',
            'channel-key-taken',
            'send-rate-limited',
            'rate-limited',
            'dispatch-refused',
            'dispatch-unavailable',
        ]);
    });

    it('keeps the system note kinds a client words', () => {
        expect(Object.values(UniboxNoteKind)).toEqual(['status-changed', 'handed-over', 'snooze-ended']);
    });
});
