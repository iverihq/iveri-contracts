import { NotificationChannel } from './notification-channel.enum.js';
import { NotificationDeliveryStatus } from './notification-delivery-status.enum.js';

describe('notification enums', () => {
    it.each([
        [NotificationChannel.EMAIL, 'email'],
        [NotificationChannel.IN_APP, 'in-app'],
    ])('pins the wire value of %s', (member, value) => {
        // Stored on every delivery row and named in each template's channel list. Changing one
        // orphans the rows already written with the old value from the worker that claims them.
        expect(member).toBe(value);
    });

    it.each([
        [NotificationDeliveryStatus.PENDING, 'pending'],
        [NotificationDeliveryStatus.IN_FLIGHT, 'in-flight'],
        [NotificationDeliveryStatus.SENT, 'sent'],
        [NotificationDeliveryStatus.DEAD_LETTERED, 'dead-lettered'],
        [NotificationDeliveryStatus.CANCELLED, 'cancelled'],
    ])('pins the wire value of %s', (member, value) => {
        expect(member).toBe(value);
    });

    it('has no delivered state, because nothing here can observe one', () => {
        // A guard on the decision recorded in the enum's own doc comment. `SENT` means a relay
        // accepted the message; a bounce arrives later and out of band, and nothing subscribes to
        // one. A `DELIVERED` member would be a green tick in every UI that no code ever sets.
        expect(Object.values(NotificationDeliveryStatus)).not.toContain('delivered');
    });

    it('has no push channel, because there is no device registry behind one', () => {
        // Same guard, other enum. A channel a caller can name and nothing can deliver looks like
        // a successful submit and reaches nobody.
        expect(Object.values(NotificationChannel)).not.toContain('push');
    });
});
