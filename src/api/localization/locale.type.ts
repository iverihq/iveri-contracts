import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

/**
 * A language a tenant publishes in.
 *
 * **A row, not an enum member.** The obvious alternative — `enum LocaleCode { EN, RU, KA }` — makes
 * adding Ukrainian a contracts release, an SDK release and a redeploy of every consumer, to add a
 * value that no code branches on. Nothing in the platform switches on *which* locale a string is
 * in; it only ever looks one up. So the set belongs in data.
 *
 * `code` is a BCP-47 tag and is what every other surface uses: the `Accept-Language` header the
 * SDK already resolves into `RequestContext.locale`, the export filename, the render request.
 */
export interface Locale {
    id: UUID;

    /** BCP-47, lowercased — `en`, `ru`, `ka`, `en-GB`. Unique within the tenant. */
    code: string;

    /** For the language picker in an English-language admin screen. */
    englishName: string;

    /** For the language picker a native speaker sees — `ქართული`, `Русский`. */
    nativeName: string;

    /**
     * The locale translators translate *from*. Exactly one per tenant.
     *
     * It is also the locale a message's source text lives in, so editing a source value is what
     * flips every other locale's translation of that message to `needs-review`. Changing which
     * locale is the source is therefore not a display preference — it moves that trigger.
     */
    isSource: boolean;

    /**
     * Whether this locale is offered at all. Inactive keeps the translations and stops them
     * being exported or rendered, which is what a locale that is half-translated needs — the
     * alternative is deleting the work to hide it.
     */
    isActive: boolean;

    /**
     * Where a lookup goes when this locale has no approved translation. Null ends the chain.
     *
     * Chains are followed transitively (`en-GB → en → null`) and are **rejected at write time if
     * they cycle**, because the resolver would otherwise loop on a row a customer can create.
     */
    fallbackCode: Nullable<string>;

    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/** `GET /api/v1/locales`. Small and unpaged — a tenant has a handful of these, not a page of them. */
export type LocaleList = Locale[];

/** `POST /api/v1/locales`. */
export interface CreateLocaleBody {
    code: string;
    englishName: string;
    nativeName: string;
    isSource?: boolean;
    isActive?: boolean;
    fallbackCode?: Nullable<string>;
}

/** `PATCH /api/v1/locales/:code`. */
export interface UpdateLocaleBody {
    englishName?: string;
    nativeName?: string;
    /** Promoting a locale to source demotes the previous one in the same transaction. */
    isSource?: boolean;
    isActive?: boolean;
    fallbackCode?: Nullable<string>;
}
