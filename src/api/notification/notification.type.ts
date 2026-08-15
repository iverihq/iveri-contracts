import type { CursorPage } from '../../type/cursor-page.type.js';
import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { NotificationChannel } from './notification-channel.enum.js';
import type { NotificationDeliveryStatus } from './notification-delivery-status.enum.js';

/** Who a notification is for, and in what language. */
export interface NotificationRecipient {
    /**
     * The person, when there is one. Required by {@link NotificationChannel.IN_APP}.
     *
     * Null for a notification to somebody who has no account yet — which is precisely the
     * invitation case, and the reason this is nullable rather than the obvious required field.
     */
    userId: Nullable<UUID>;

    /** Required by {@link NotificationChannel.EMAIL}. */
    emailAddress: Nullable<string>;

    /**
     * BCP-47. The language of the **recipient**, not of whoever submitted the notification.
     *
     * Null falls back to the tenant's source locale. This is the field that makes rendering a
     * runtime concern rather than a build-time one: an agent working in English invites a
     * colleague who reads Georgian, and the email is the colleague's.
     */
    localeCode: Nullable<string>;
}

/**
 * One attempt-tracked send of a notification down one channel.
 *
 * This row **is** the outbox. It is written in the same transaction as the notification it belongs
 * to, claimed by a worker afterwards, and retried on its own schedule — so a channel that is down
 * delays one delivery rather than failing the submit.
 */
export interface NotificationDelivery {
    id: UUID;

    notificationId: UUID;

    channel: NotificationChannel;

    status: NotificationDeliveryStatus;

    /** Attempts actually made. A refusal that costs no attempt does not increment it. */
    attemptCount: number;

    /** When the next attempt is due. Null once the delivery reaches a terminal state. */
    nextAttemptAt: Nullable<IsoDateTime>;

    sentAt: Nullable<IsoDateTime>;

    /**
     * Why the last attempt failed, in words an operator can act on.
     *
     * Never carries the rendered body or the recipient's address — a delivery log is read by more
     * people than the mailbox it describes.
     */
    lastError: Nullable<string>;

    /**
     * The channel's own handle for what it accepted — an SMTP message id.
     *
     * Opaque and provider-shaped by nature, kept so a support question about one email can be
     * traced into a relay's logs. Nothing branches on it.
     */
    providerReference: Nullable<string>;

    /** When the recipient opened it. In-app only; email opens are not tracked. */
    readAt: Nullable<IsoDateTime>;

    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/**
 * Something the platform decided to tell somebody.
 *
 * **It carries no status of its own**, and that is the load-bearing shape here. Status lives on
 * {@link NotificationDelivery}, one per channel, because a notification that emailed successfully
 * and dead-lettered in the inbox has two true answers and no single one. A caller asking "did it
 * go" reads `deliveries`, which answers precisely rather than approximately.
 */
export interface Notification {
    id: UUID;

    /** The {@link NotificationTemplate} key this was rendered from. */
    type: string;

    recipient: NotificationRecipient;

    /**
     * Values for the template's declared placeholders.
     *
     * Stored as submitted and re-used on every retry, so a message that is retried an hour later
     * says what it said the first time. Rendering happens per attempt; the *inputs* do not move.
     */
    variables: Record<string, string | number>;

    /**
     * The caller's deduplication key, unique per tenant.
     *
     * Enforced by a unique index rather than by a read before the insert. Two replicas processing
     * the same event submit at the same instant, and the read-then-insert both of them do
     * succeeds — the index is the only thing that turns that into one email.
     */
    idempotencyKey: Nullable<string>;

    deliveries: NotificationDelivery[];

    createdAt: IsoDateTime;
}

/** `POST /api/v1/notifications` */
export interface SubmitNotificationBody {
    /** A {@link NotificationTemplate} key. Unknown keys are refused at submit, not at send. */
    type: string;

    recipient: {
        userId?: Nullable<UUID>;
        emailAddress?: Nullable<string>;
        localeCode?: Nullable<string>;
    };

    variables?: Nullable<Record<string, string | number>>;

    /** Strongly recommended. Without one, a retried submit tells somebody the same thing twice. */
    idempotencyKey?: Nullable<string>;
}

export interface SubmitNotificationResponse {
    id: UUID;

    /**
     * True when the idempotency key matched an existing notification and nothing was created.
     *
     * Reported rather than flattened into success: it means the recipient was already being told,
     * so a caller treating it as a fresh send would write a second record of one event.
     */
    isDuplicate: boolean;

    deliveries: NotificationDelivery[];
}

/**
 * A row in the caller's own in-app inbox, already rendered.
 *
 * Rendered text is returned rather than a key and variables, because it was rendered once at send
 * time in the recipient's language and re-rendering it on read would let a published translation
 * change what a notification from last week says.
 */
export interface InAppNotification {
    id: UUID;

    notificationId: UUID;

    type: string;

    subject: Nullable<string>;

    body: string;

    readAt: Nullable<IsoDateTime>;

    createdAt: IsoDateTime;
}

export type InAppNotificationPage = CursorPage<InAppNotification>;

export type NotificationDeliveryPage = CursorPage<NotificationDelivery>;
