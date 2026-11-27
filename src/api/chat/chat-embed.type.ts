import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

/**
 * Somebody a product puts in a conversation. A user of the product's own tenant, named the way the
 * product names them. There is deliberately no phone or email field: the other side never sees either.
 */
export interface EmbeddedChatParticipant {
    userId: UUID;
    displayName: string;
    /** "Driver", "Passenger", "Shop". */
    label?: Nullable<string>;
    /** An address the product already serves publicly. */
    avatarUrl?: Nullable<string>;
    /** `request` puts it in their Requests until they accept, which is how Ezo's message requests work. */
    asRequest?: boolean;
    /**
     * Whether somebody arriving reads what was said before they came. Omitted means false: a newcomer starts at the
     * current end. A shop sets it for a member of staff taking up an order's conversation, who has to read what the
     * customer already asked. Read only when the participant arrives or comes back.
     */
    seesHistory?: boolean;
}

/**
 * `PUT /embed/conversations`, under `chat:embed:manage`. An upsert keyed on the context, so a retry,
 * two replicas and a reassignment land on one conversation, and participants are reconciled.
 */
export interface OpenEmbeddedChatRequest {
    /**
     * The company the conversation is for, when it is not the token's own. A 403 unless the token holds
     * `chat:embed:manage-any` and comes from Iveri's operator workspace; naming your own company counts as naming one.
     */
    tenantId?: UUID;
    context: { product: string; type: string; id: string };
    title: string;
    subtitle?: Nullable<string>;
    participants: EmbeddedChatParticipant[];
    /**
     * A conversation of many, such as a team, whatever its size today. Without it a conversation that happens
     * to hold two people is drawn as one person talking to the other, under that person's name. Sent on every
     * `PUT`; omitted means false.
     */
    isGroup?: boolean;
    /** Sending ends here and reading stays. Omitted means until closed. */
    writableUntil?: Nullable<IsoDateTime>;
    /**
     * Whether its people may call each other, honoured only while it is writable. Sent on every `PUT`; omitted means
     * false. Taxi allows it from a driver's assignment until the ride is over.
     */
    callable?: boolean;
    link?: Nullable<{ web?: Nullable<string>; app?: Nullable<string> }>;
}

export interface OpenEmbeddedChatResponse {
    conversationId: UUID;
    created: boolean;
}

/** A notice from the product: a translation key in the `chat-kit` namespace and its variables. */
export interface PostEmbeddedSystemMessageRequest {
    /** As on `OpenEmbeddedChatRequest`: the company the conversation was opened for, behind `chat:embed:manage-any`. */
    tenantId?: UUID;
    key: string;
    variables?: Record<string, string>;
    /** So a retried notice is posted once. */
    idempotencyKey: UUID;
}

/** `POST /embed/conversations/:id/close`. An empty body closes one in the token's own company. */
export interface CloseEmbeddedChatRequest {
    /** As on `OpenEmbeddedChatRequest`: the company the conversation was opened for, behind `chat:embed:manage-any`. */
    tenantId?: UUID;
}

/** `GET /embed/conversations`: the context to look up, and the company it is in as on `OpenEmbeddedChatRequest`. */
export interface EmbeddedChatReferenceQuery {
    tenantId?: UUID;
    product: string;
    type: string;
    id: string;
}

export interface EmbeddedChatReference {
    conversationId: UUID;
    context: { product: string; type: string; id: string };
    closedAt: Nullable<IsoDateTime>;
}
