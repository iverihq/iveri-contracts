import type { CursorPage } from '../../type/cursor-page.type.js';
import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ChannelPlatform } from './channel-platform.enum.js';

/**
 * One way of reaching a contact on one platform.
 *
 * A person is not a phone number. The same human messages a business from WhatsApp on Monday and
 * from Instagram on Thursday, and an inbox that treats those as two strangers is an inbox that
 * loses the thread — so identities are a child collection rather than columns on the contact.
 *
 * That shape is what makes merging possible later without a migration. Merging is **not built**;
 * the modelling for it is, which is the part that is expensive to retrofit.
 */
export interface ContactIdentity {
    id: UUID;

    platform: ChannelPlatform;

    /**
     * The provider's own identifier for this person — a WhatsApp `wa_id`, an Instagram-scoped
     * user id.
     *
     * Unique per `(tenant, platform)`. **Scoped ids are not portable across platforms**: the same
     * person has an entirely different id on Instagram and on Messenger, and treating one as the
     * other merges two strangers. That is why the platform is part of the key rather than the id
     * being assumed globally unique.
     */
    externalId: string;

    /** The name the provider supplied, when it supplied one. Not authoritative and often absent. */
    displayName: Nullable<string>;

    createdAt: IsoDateTime;
}

/**
 * A person the tenant talks to.
 *
 * Personal data, deliberately minimal: Unibox stores what it needs to thread a conversation and
 * address someone by name. A CRM's worth of fields belongs in the vertical that needs them, and
 * §17's GDPR line is materially cheaper to honour on a small table.
 */
export interface Contact {
    id: UUID;

    /**
     * The name shown in the inbox.
     *
     * Editable by an agent, because a provider's display name is frequently a handle or absent,
     * and correcting it is the first thing anyone does. Falls back to the first identity's
     * `displayName`, then to its `externalId`.
     */
    displayName: string;

    email: Nullable<string>;

    /** E.164 where known. Not the same as a WhatsApp identity's `externalId`, which is scoped. */
    phone: Nullable<string>;

    /** Free-form agent notes. Not shown to the contact and never sent anywhere. */
    notes: Nullable<string>;

    /** Lowercased, deduplicated. For filtering the inbox, not for automation. */
    tags: string[];

    identities: ContactIdentity[];

    /** When this contact last sent or received a message. Null until the first one. */
    lastActivityAt: Nullable<IsoDateTime>;

    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/** `GET /api/v1/contacts`. Cursor-paged: inbound traffic appends to it while it is being read. */
export type ContactsPage = CursorPage<Contact>;

/** Query for `GET /api/v1/contacts`. */
export interface GetContactsQuery {
    limit?: number;

    /** Opaque cursor from the previous page's `nextCursor`. Never parse it. */
    after?: Nullable<string>;

    /** Case-insensitive substring of the display name, email or phone. */
    search?: Nullable<string>;

    tag?: Nullable<string>;
}

/**
 * `POST /api/v1/contacts`.
 *
 * Creating a contact by hand is the uncommon path — almost every contact arrives because someone
 * messaged in, and inbound creates them. This exists so an agent can prepare a record before a
 * conversation starts, and so a vertical can seed one.
 */
export interface CreateContactBody {
    displayName: string;
    email?: Nullable<string>;
    phone?: Nullable<string>;
    notes?: Nullable<string>;
    tags?: Nullable<string[]>;
}

/**
 * `PATCH /api/v1/contacts/:id`.
 *
 * `identities` is absent: an identity is asserted by a provider, not chosen by an agent. Adding
 * one by hand is how two strangers get merged into one record, and there is no undo for that.
 */
export interface UpdateContactBody {
    displayName?: string;
    email?: Nullable<string>;
    phone?: Nullable<string>;
    notes?: Nullable<string>;

    /** Replaces the whole set. Omit to leave it alone; `[]` clears it. */
    tags?: Nullable<string[]>;
}
