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
    type RestaurantOrderChatStaff,
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

    it('names who answers diners without an email, a phone or a role', () => {
        const staff: RestaurantOrderChatStaff = {
            items: [
                {
                    userId: '00000000-0000-4000-8000-000000000001',
                    displayName: 'Nino Beridze',
                    isMe: true,
                    joinedAt: '2026-11-21T10:00:00.000Z',
                },
            ],
        };

        expect(Object.keys(staff.items[0]).sort()).toEqual(['displayName', 'isMe', 'joinedAt', 'userId']);
    });
});
