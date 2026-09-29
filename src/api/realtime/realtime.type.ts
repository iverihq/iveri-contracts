import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { RealtimeEventType } from './realtime-event-type.enum.js';
import type { RealtimeResourceType } from './realtime-resource-type.enum.js';

export const REALTIME_CLIENT_EVENT = {
    SUBSCRIBE: 'realtime.subscribe',
    UNSUBSCRIBE: 'realtime.unsubscribe',
} as const;

export const REALTIME_SERVER_EVENT = {
    READY: 'realtime.ready',
    SUBSCRIBED: 'realtime.subscribed',
    RESOURCE_UPDATED: 'realtime.resource-updated',
    ERROR: 'realtime.error',
} as const;

export const REALTIME_PROTOCOL_VERSION = 1;
export const MAX_REALTIME_SUBSCRIPTIONS_PER_SOCKET = 100;
export const MAX_REALTIME_EVENT_BYTES = 4 * 1024;
export const DEFAULT_REALTIME_GRANT_TTL_SECONDS = 120;
export const MAX_REALTIME_GRANT_TTL_SECONDS = 300;
export const REALTIME_GRANT_AUDIENCE = 'iveri-realtime-subscription';
export const REALTIME_GRANT_ISSUER = 'iveri-realtime';

/**
 * Requested by an owning API only after it has authorized a person to read the resource.
 *
 * `tenantId` is absent: it comes from the API's service token. The grant is bound to
 * `subjectId`, so copying one to another authenticated socket does not authorize that socket.
 */
export interface IssueRealtimeSubscriptionGrantBody {
    subjectId: UUID;
    resourceType: RealtimeResourceType;
    resourceId: UUID;
    ttlSeconds?: number;
}

export interface RealtimeSubscriptionGrantResponse {
    grant: string;
    expiresAt: IsoDateTime;
}

/** Claims inside a subscription grant signed and verified only by `iveri-realtime`. */
export interface RealtimeSubscriptionGrantClaims {
    jti: UUID;
    sub: UUID;
    tid: UUID;
    azp: UUID;
    resourceType: RealtimeResourceType;
    resourceId: UUID;
    purpose: 'subscription';
    iat: number;
    exp: number;
    iss: typeof REALTIME_GRANT_ISSUER;
    aud: typeof REALTIME_GRANT_AUDIENCE;
}

/**
 * A product service's best-effort change notification.
 *
 * The tenant comes from the authenticated service principal and is intentionally absent here.
 * `idempotencyKey` makes an HTTP retry harmless; no domain data or location coordinates travel
 * over this channel.
 */
export interface PublishRealtimeEventBody {
    idempotencyKey: UUID;
    resourceType: RealtimeResourceType;
    resourceId: UUID;
    event: RealtimeEventType;
    version: number;
    occurredAt: IsoDateTime;
}

export interface PublishRealtimeEventResponse {
    accepted: boolean;
    duplicate: boolean;
}

/** A socket subscribes with grants, never with client-chosen room names or bare resource ids. */
export interface RealtimeSubscribeRequest {
    grants: string[];
}

export interface RealtimeUnsubscribeRequest {
    subscriptions: RealtimeSubscription[];
}

export interface RealtimeSubscription {
    resourceType: RealtimeResourceType;
    resourceId: UUID;
}

export interface RealtimeReadyMessage {
    protocolVersion: typeof REALTIME_PROTOCOL_VERSION;
}

export interface RealtimeSubscribedMessage {
    subscriptions: RealtimeSubscription[];
}

export interface RealtimeResourceUpdatedMessage {
    resourceType: RealtimeResourceType;
    resourceId: UUID;
    event: RealtimeEventType;
    version: number;
    occurredAt: IsoDateTime;
}

export interface RealtimeErrorMessage {
    code: 'UNAUTHENTICATED' | 'FORBIDDEN' | 'INVALID_GRANT' | 'INVALID_SUBSCRIPTION' | 'SUBSCRIPTION_LIMIT_REACHED';
    message: string;
}

export type RealtimeSubscriptionAck =
    { ok: true; message: RealtimeSubscribedMessage } | { ok: false; message: RealtimeErrorMessage };
