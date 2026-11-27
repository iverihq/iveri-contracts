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
    RestaurantRefusal,
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

    it('keeps the refusals clients translate', () => {
        expect(Object.values(RestaurantRefusal)).toEqual([
            'dish-unavailable',
            'channel-closed',
            'online-payment-unavailable',
            'sign-in-to-pay',
            'below-delivery-minimum',
            'closed-now',
            'time-unavailable',
            'closed-at-time',
            'out-of-delivery-range',
            'branch-closed',
            'order-not-payable',
            'payment-page-failed',
            'review-too-early',
            'already-reviewed',
            'bookings-off',
            'party-too-large',
            'booking-time-unavailable',
            'table-taken',
            'no-table-fits',
            'booking-finished',
            'booking-moved-on',
            'order-finished',
            'order-moved-on',
            'not-in-kitchen',
            'bill-closed',
            'more-than-owing',
            'refund-exceeds-payment',
            'bill-orders-open',
            'bill-money-owing',
            'unpublish-first',
            'setup-incomplete',
        ]);
    });
});
