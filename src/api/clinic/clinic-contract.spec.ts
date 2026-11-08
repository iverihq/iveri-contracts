import { describe, expect, it } from 'vitest';

import { ClinicResourceStatus } from './index.js';

describe('clinic contract', () => {
    it('keeps the resource status wire values', () => {
        expect(Object.values(ClinicResourceStatus)).toEqual(['active', 'inactive']);
    });
});
