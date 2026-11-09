import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ClinicMediaImage } from './clinic-media.type.js';
import type { LocalizedText } from './localized-text.type.js';

export interface ClinicArticle {
    id: UUID;
    slug: string;
    title: LocalizedText;
    summary: LocalizedText;
    /** Paragraphs split by a blank line, `## ` for a heading and `- ` for a list item. Never HTML. */
    body: LocalizedText;
    specialtyId: Nullable<UUID>;
    cover: Nullable<ClinicMediaImage>;
    isPublished: boolean;
    publishedAt: Nullable<IsoDateTime>;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface SaveClinicArticleRequest {
    slug: string;
    title: LocalizedText;
    summary: LocalizedText;
    body: LocalizedText;
    specialtyId: Nullable<UUID>;
    isPublished: boolean;
}

export interface PublicArticleSummary {
    id: UUID;
    slug: string;
    title: LocalizedText;
    summary: LocalizedText;
    specialtyId: Nullable<UUID>;
    cover: Nullable<ClinicMediaImage>;
    publishedAt: IsoDateTime;
}

export interface PublicArticle extends PublicArticleSummary {
    body: LocalizedText;
}
