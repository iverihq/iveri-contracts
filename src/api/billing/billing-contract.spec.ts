import { describe, expect, it } from 'vitest';

import { BillingInvoiceStatus, USAGE_LIMIT_REACHED_REASON } from './index.js';

describe('billing contract', () => {
    it('keeps the invoice states billing stores', () => {
        // Billing writes these strings into its rows; renaming one makes every stored invoice unreadable here.
        expect(Object.values(BillingInvoiceStatus)).toEqual(['open', 'paid', 'void']);
    });

    it('names a reached limit the way products answer it', () => {
        expect(USAGE_LIMIT_REACHED_REASON).toBe('usage-limit-reached');
    });
});
