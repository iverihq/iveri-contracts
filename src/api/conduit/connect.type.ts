import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ConnectAttemptStatus } from './connect-attempt-status.enum.js';

/**
 * Query parameters Conduit adds to the return address when a consent flow ends.
 *
 * `?conduitConnectAttempt=<id>&conduitConnectStatus=connected|failed`. A hint for the page a person
 * lands on — see {@link ConnectAttemptStatus} on why a product reads the attempt before acting.
 */
export const CONNECT_RETURN_ATTEMPT_PARAM = 'conduitConnectAttempt';
export const CONNECT_RETURN_STATUS_PARAM = 'conduitConnectStatus';

/**
 * `POST /api/v1/connections/:id/connect` — start a consent flow on a connection whose connector
 * uses `oauth2-authorization-code`.
 *
 * Started on a **company's** connection, which holds the app's client id and secret. Without
 * `ownerUserId` the tokens land on that connection — Slack's "Add to Slack" by the company's admin.
 * With it they land on that person's own connection under the same key, created on first success
 * — one employee connecting their own Slack. A person may start a flow only for themselves; a
 * product's service may start one for anybody in its tenant, which is how a website's "Connect
 * Slack" button reaches Conduit without the product holding a token.
 */
export interface StartConnectBody {
    /**
     * Where the person's browser is sent when the flow ends, success or not.
     *
     * Its origin must be on Conduit's allowlist of product addresses, or the start is refused: a
     * callback that redirected anywhere it was told would be an open redirect on our own domain,
     * the shape of a phishing link that looks like ours.
     */
    returnUrl: string;

    /** The person the connection is for. Absent connects the company's own connection. */
    ownerUserId?: Nullable<UUID>;
}

/** One consent flow, from start to callback. `GET /api/v1/connect-attempts/:id`. */
export interface ConnectAttempt {
    id: UUID;

    /** The company connection the flow was started on, whose app credentials it uses. */
    connectionId: UUID;

    /** Its key, which a person's connection shares. */
    connectionKey: string;

    /** The person the flow is for, or null for the company's own connection. */
    ownerUserId: Nullable<UUID>;

    /**
     * The connection now holding the tokens, once connected.
     *
     * The same as {@link connectionId} for a company; the person's own connection otherwise.
     */
    resultConnectionId: Nullable<UUID>;

    status: ConnectAttemptStatus;

    /**
     * Why it failed: the provider's own error code (`access_denied` when the person declined), or
     * what was wrong with the callback. Never a token or a code.
     */
    failureReason: Nullable<string>;

    /** After this the state and verifier are void. Minutes, not hours. */
    expiresAt: IsoDateTime;

    completedAt: Nullable<IsoDateTime>;
    createdAt: IsoDateTime;
}

/** `201 Created` from `POST /api/v1/connections/:id/connect`. */
export interface ConnectStart {
    attempt: ConnectAttempt;

    /**
     * The provider's consent page, with the state and the PKCE challenge already in it.
     *
     * Send the person's browser here. It holds no secret — the verifier never leaves Conduit — but
     * it is single-use and expires with the attempt.
     */
    authorizationUrl: string;
}
