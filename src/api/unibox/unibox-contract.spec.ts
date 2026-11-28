import { describe, expect, it } from 'vitest';

import { UniboxRefusal } from './index.js';

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
});
