import type { ErrorCode } from '../enum/error-code.enum.js';

import type { Maybe } from './nil.type.js';

/**
 * Envelope for a successful HTTP response.
 *
 * Every service wraps its payload in this shape, so a client can branch on
 * `success` before touching anything else and never has to guess whether a
 * 200 body is data or an error report.
 *
 * @typeParam T - the response payload type.
 */
export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
}

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
 * Envelope for a failed HTTP response, emitted by the SDK's global exception
 * filter for every non-2xx status.
 */
export interface ApiErrorResponse {
    success: false;
    error: ApiErrorBody;

    /** ISO-8601 timestamp of when the error was rendered. */
    timestamp: string;

    /** Request path that produced the error, without the query string. */
    path: string;
}

/**
 * Discriminated union of both envelopes. Narrow on `success`:
 *
 * ```ts
 * if (!response.success) {
 *     return handle(response.error.code);
 * }
 * use(response.data);
 * ```
 *
 * @typeParam T - the payload type on the success branch.
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
