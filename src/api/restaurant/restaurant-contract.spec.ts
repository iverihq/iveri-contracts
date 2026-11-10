import { describe, expect, it } from 'vitest';

import {
    RestaurantAllergen,
    RestaurantBillStatus,
    RestaurantChannel,
    RestaurantDietaryTag,
    RestaurantLineStatus,
    RestaurantOrderSource,
    RestaurantOrderStatus,
    RestaurantPaymentMethod,
    RestaurantResourceStatus,
    RestaurantServiceRequestKind,
} from './index.js';

describe('restaurant contract', () => {
    it('keeps the status wire values', () => {
        expect(Object.values(RestaurantResourceStatus)).toEqual(['active', 'inactive']);
        expect(Object.values(RestaurantOrderStatus)).toEqual([
            'awaiting-payment',
            'placed',
            'in-kitchen',
            'ready',
            'out-for-delivery',
            'completed',
            'cancelled',
        ]);
        expect(Object.values(RestaurantLineStatus)).toEqual(['queued', 'preparing', 'ready', 'voided']);
        expect(Object.values(RestaurantBillStatus)).toEqual(['open', 'settled', 'cancelled']);
    });

    it('keeps the channels and sources', () => {
        expect(Object.values(RestaurantChannel)).toEqual(['dine-in', 'takeaway', 'delivery']);
        expect(Object.values(RestaurantOrderSource)).toEqual(['staff', 'table', 'online']);
    });

    it('keeps the payment methods and service requests', () => {
        expect(Object.values(RestaurantPaymentMethod)).toEqual(['cash', 'card', 'online']);
        expect(Object.values(RestaurantServiceRequestKind)).toEqual(['waiter', 'bill']);
    });

    it('names the fourteen allergens', () => {
        expect(Object.values(RestaurantAllergen)).toHaveLength(14);
    });

    it('carries the fasting mark a Georgian menu needs', () => {
        expect(Object.values(RestaurantDietaryTag)).toContain('lenten');
    });
});
