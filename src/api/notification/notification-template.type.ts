import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { NotificationChannel } from './notification-channel.enum.js';

/**
 * What a notification *type* means: which channels it reaches and which strings it renders.
 *
 * A template holds **no text**. It names message keys in `iveri-localization-api`, which resolves
 * them into the recipient's own language at send time. Storing the wording here instead would
 * give the platform two places to author user-facing copy, and the second one would be the one
 * without ICU validation, without a review gate and without Russian — see §13.1 of the workspace
 * guide, which draws that line for exactly this case.
 *
 * **Built-in templates ship in code and a tenant row overrides one by key**, the same arrangement
 * `conduit-api` uses for provider and connector manifests. `user.invitation` has to exist before
 * any tenant has configured anything, and a platform whose password-reset email depends on a seed
 * row is a platform where one missing row means nobody can get back into their account.
 */
export interface NotificationTemplate {
    /**
     * The stable type key a caller submits — `user.invitation`, `user.password-reset`.
     *
     * Dotted `<aggregate>.<event>`, lowercase. It is what a caller writes down, so it never
     * changes once shipped; a rename is a new key and a deprecation of the old one.
     */
    key: string;

    /** Null for a built-in. A tenant override is a real row and carries an id. */
    id: Nullable<UUID>;

    /**
     * Which channels this type fans out to. One delivery row is written per channel.
     *
     * An empty list is refused on write rather than stored: a template that reaches nobody is a
     * notification that silently disappears, and the submit would still answer 202.
     */
    channels: NotificationChannel[];

    /** The localization namespace holding this template's strings. */
    namespaceKey: string;

    /** Message key for the subject line. Null for channels that have no subject. */
    subjectMessageKey: Nullable<string>;

    /** Message key for the body. Always present — a notification with no body says nothing. */
    bodyMessageKey: string;

    /**
     * Placeholder names the body and subject need supplied at submit time.
     *
     * Checked when a notification is submitted, not when it is sent. A missing variable fails
     * identically on every attempt, so discovering it five backoffs later tells the caller nothing
     * they can still act on — the same rule Conduit applies to an unfillable path template.
     */
    requiredVariables: string[];

    /**
     * False for a tenant's own row, true for one of the platform's.
     *
     * Surfaced so a panel can say "you are overriding a built-in" rather than presenting a
     * customised password-reset email as if the platform had no opinion about it.
     */
    isBuiltIn: boolean;

    createdAt: Nullable<IsoDateTime>;
    updatedAt: Nullable<IsoDateTime>;
}

/** `PUT /api/v1/templates/{key}` — create or replace a tenant's override of a template. */
export interface UpsertNotificationTemplateBody {
    channels: NotificationChannel[];
    namespaceKey: string;
    subjectMessageKey?: Nullable<string>;
    bodyMessageKey: string;
    requiredVariables?: Nullable<string[]>;
}
