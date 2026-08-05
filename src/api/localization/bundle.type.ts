import type { IsoDateTime } from '../../type/iso-date-time.type.js';

/**
 * One namespace at one locale, flattened — what a build pulls and commits into a repo.
 *
 * **UI strings are fetched at build time, never at runtime, and that is the load-bearing decision
 * in this service.** A React app that fetched its labels on mount would put a network call in
 * front of every first paint, make this service a hard dependency of two admin panels that are
 * otherwise happy while it is down, and render a screen of empty strings when it is not. The
 * strings were known when the app compiled; that is when they should be baked in.
 *
 * So a consumer runs `pnpm i18n:pull`, gets one of these per locale, writes it to
 * `src/locale/<code>.json`, and commits it. The diff is reviewable, the app has no runtime
 * dependency, and rolling back a bad translation is `git revert`.
 *
 * {@link RenderedMessage} is the other half — for text produced on a server, where there is no
 * bundle to bake into.
 */
export interface TranslationBundle {
    namespaceKey: string;
    localeCode: string;

    /** The release this was cut from. Pinned by the consumer; `latest` resolves to a number. */
    version: number;

    generatedAt: IsoDateTime;

    /**
     * Message key to ICU value.
     *
     * **Flat, not nested.** `{"inbox.title": "..."}` rather than `{"inbox": {"title": "..."}}`,
     * even though the dotted keys invite nesting. Nesting means a key containing a dot becomes
     * ambiguous, and it makes `messages[key]` — the only lookup anyone performs — a path walk
     * instead of a property read.
     */
    messages: Record<string, string>;

    /**
     * Keys served from a fallback locale rather than this one, and where they came from.
     *
     * Emitted so a build can fail, or warn, on an incomplete bundle. Without it a half-translated
     * locale looks identical to a complete one: every key resolves, and half of them are English.
     */
    fallbacks: Record<string, string>;
}
