import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { Paginated } from '../../type/paginated.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ChannelPlatform } from './channel-platform.enum.js';

/**
 * One messaging account a tenant has connected — a WhatsApp number, an Instagram business
 * account, a Facebook page.
 *
 * A channel is the seam between Unibox and Conduit, and it points at Conduit twice, in opposite
 * directions:
 *
 * - **Inbound**, Conduit forwards a provider's raw webhook to Unibox and presents this channel's
 *   ingest secret. Conduit does not parse it — it cannot, because §11 forbids it knowing what a
 *   chat is — so normalizing the bytes into a message is Unibox's job.
 * - **Outbound**, a reply is submitted to Conduit naming `connectionKey` and `sendOperation`.
 *   Unibox never calls the Graph API itself (§12).
 *
 * Neither reference is a foreign key, because they name rows in another service's database. A
 * `connectionKey` that no longer resolves is a misconfiguration Unibox reports; it is not
 * something Unibox can prevent, and pretending otherwise would mean Unibox reading Conduit's
 * tables, which is exactly what §2 forbids.
 */
export interface Channel {
    id: UUID;

    /** Tenant-scoped, stable, and how a normalizer is chosen for inbound traffic. */
    key: string;

    name: string;

    platform: ChannelPlatform;

    /**
     * The account's own identifier at the provider — a WhatsApp phone-number id, an Instagram
     * account id.
     *
     * Stored because a provider's webhook names the *recipient* account, and a tenant may have
     * several channels on one platform. Without it there is no way to tell which of two WhatsApp
     * numbers a message arrived at, and both would look equally plausible.
     */
    externalAccountId: string;

    /** Conduit connection a reply is dispatched through. Loose reference into another service. */
    connectionKey: string;

    /** Which of that connector's operations sends a message. */
    sendOperation: string;

    /**
     * Whether this channel accepts inbound traffic and sends replies.
     *
     * Turning it off stops new conversations and refuses sends. It does **not** delete anything
     * already received: a channel a customer disconnected still has a history someone needs to
     * read.
     */
    isActive: boolean;

    /**
     * Whether an ingest secret is currently set.
     *
     * A boolean, never the value. The secret is what authenticates Conduit to Unibox, so it is
     * envelope-encrypted, returned by no endpoint, and shown to the operator exactly once — at
     * the moment it is generated, when it also has to be pasted into Conduit's destination
     * headers. Same control as an endpoint's signing secret in Conduit.
     */
    hasIngestSecret: boolean;

    /** When a message was last received or sent here. Null until the first one. */
    lastActivityAt: Nullable<IsoDateTime>;

    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/** `GET /api/v1/channels`. Offset-paged: a tenant has a handful of channels, not a stream of them. */
export type ChannelsPage = Paginated<Channel>;

/** `POST /api/v1/channels`. */
export interface CreateChannelBody {
    /** Lowercase, `[a-z0-9-]`. Unique within the tenant and immutable once created. */
    key: string;

    name: string;

    platform: ChannelPlatform;

    externalAccountId: string;

    connectionKey: string;

    /** Defaults to the platform's conventional send operation when omitted. */
    sendOperation?: Nullable<string>;
}

/**
 * `PATCH /api/v1/channels/:id`.
 *
 * `key` and `platform` are absent on purpose. The key is what an ingest request resolves and what
 * an operator wrote into Conduit's configuration; the platform decides which normalizer reads the
 * history already stored against this channel. Changing either would silently reinterpret rows
 * that are already there, so both are create-only — delete and recreate is the honest path.
 */
export interface UpdateChannelBody {
    name?: string;
    externalAccountId?: string;
    connectionKey?: string;
    sendOperation?: string;
    isActive?: boolean;
}

/**
 * `POST /api/v1/channels/:id/ingest-secret` — the **only** response that ever carries the secret.
 *
 * Rotating replaces the stored value immediately, so the previous secret stops working the moment
 * this returns. That is deliberate and it is a brief outage by design: an ingest secret that
 * overlapped with its replacement would mean a leaked one keeps working for as long as the
 * overlap, which is the thing rotation exists to end.
 */
export interface ChannelIngestSecretResponse {
    channelId: UUID;

    /** Shown once. Not stored in retrievable form, and no endpoint returns it again. */
    ingestSecret: string;

    /** The URL to configure as the destination in Conduit, for convenience. */
    ingestUrl: string;

    /** The header Conduit must carry the secret in. */
    ingestHeaderName: string;
}
