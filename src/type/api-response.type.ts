import type { ErrorCode } from '../enum/error-code.enum.js';

import type { Maybe } from './nil.type.js';

/**
 * The error half of {@link ApiErrorResponse}.
 *
 * `message` is for humans and may change at any time — clients branch on
 * `code`, never on message text.
 */
export interface ApiErrorBody {
    /** Stable, machine-readable classification. The only field safe to branch on. */
    code: ErrorCode;

    /** Human-readable summary. Safe to surface to a developer, not to an end user. */
    message: string;

    /**
     * Structured context — which field failed validation, which constraint was
     * violated. Never contains secrets, tokens, or raw upstream payloads.
     */
    details?: Maybe<Record<string, unknown>>;

    /**
     * The request's correlation id, echoed so a user can quote it in a support
     * ticket and the whole request can be pulled out of the logs.
     */
    correlationId?: Maybe<string>;
}

/**
 * Envelope for a failed response, emitted by the SDK's `GlobalExceptionFilter` for every
 * non-2xx status.
 *
 * **Only errors are enveloped.** A success is the bare payload — a tenant response *is* a
 * tenant, not a `{ success, data }` wrapper around one. So `success: false` discriminates a
 * shape the client receives *instead of* its payload, never alongside it:
 *
 * ```ts
 * const body: unknown = await response.json();
 *
 * if (!response.ok) {
 *     throw new ApiError(body as ApiErrorResponse);
 * }
 *
 * return body as Tenant;
 * ```
 *
 * This file also declared `ApiSuccessResponse<T>` and a union over the two until 0.3.0.
 * Nothing ever sent it: both `iveri-identity-api` and `conduit-api` register the exception
 * filter and no success interceptor. A type describing a response no service produces is worse
 * than no type at all — reading it, the natural thing to write is `body.data`, which is
 * `undefined` for every call in the application. It was removed rather than made true, because
 * bare payloads were already shipped across two services and a frontend and the envelope added
 * nothing to the HTTP status a client must check regardless.
 */
export interface ApiErrorResponse {
    success: false;
    error: ApiErrorBody;

    /** ISO-8601 timestamp of when the error was rendered. */
    timestamp: string;

    /** Request path that produced the error, without the query string. */
    path: string;
}
