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
}

/**
 * `PUT /embed/conversations`, under `chat:embed:manage`. An upsert keyed on the context, so a retry,
 * two replicas and a reassignment land on one conversation, and participants are reconciled.
 */
export interface OpenEmbeddedChatRequest {
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
    key: string;
    variables?: Record<string, string>;
    /** So a retried notice is posted once. */
    idempotencyKey: UUID;
}

export interface EmbeddedChatReference {
    conversationId: UUID;
    context: { product: string; type: string; id: string };
    closedAt: Nullable<IsoDateTime>;
}
