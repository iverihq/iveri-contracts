import type { Nullable } from '../../type/nil.type.js';

/**
 * `POST /api/v1/render` — resolve and format messages server-side.
 *
 * The counterpart to {@link TranslationBundle}, for the case a bundle cannot serve: text produced
 * on a server, where there is no compiled app to bake strings into and the target locale belongs
 * to whoever will read the message rather than whoever is making the request. An OTP body, an
 * invoice line, an order confirmation.
 *
 * **Batched, because the caller almost always needs several.** An invoice email is a subject, a
 * greeting, six line labels and a footer, and one HTTP round trip per string would put this
 * service on the latency path of every email the platform sends.
 */
export interface RenderBody {
    /** BCP-47. Falls back through the locale chain when this one has no translation. */
    localeCode: string;

    items: RenderItem[];
}

export interface RenderItem {
    namespaceKey: string;
    messageKey: string;

    /**
     * Values for the message's declared placeholders.
     *
     * A missing one is an error rather than an empty substitution: an OTP that renders as
     * "Your code is " is worse than an error, because it is sent.
     */
    variables?: Record<string, string | number>;
}

export interface RenderResult {
    items: RenderedMessage[];
}

export interface RenderedMessage {
    namespaceKey: string;
    messageKey: string;

    /** The locale actually used, which is not necessarily the one asked for. */
    localeCode: string;

    /** Formatted for {@link localeCode} — plural branches taken, numbers and dates localised. */
    value: string;

    /**
     * True when the requested locale had nothing and the chain supplied this.
     *
     * Returned rather than hidden so a caller that must not send a half-localised message — an
     * OTP, a legal notice — can decide for itself rather than discovering it from a customer.
     */
    isFallback: boolean;

    /** The release the value came from. Null for a message that has never been published. */
    version: Nullable<number>;
}
