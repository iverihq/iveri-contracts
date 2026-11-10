import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

export type { LocalizedText };

export interface RestaurantSocialLink {
    network: string;
    url: string;
}

/** What a restaurant publishes about itself. With no row, or unpublished, its public routes answer 404. */
export interface RestaurantProfile {
    id: UUID;
    slug: string;
    name: LocalizedText;
    tagline: LocalizedText | null;
    about: LocalizedText | null;
    /** ISO 4217. Fixed once a bill names it. */
    currency: string;
    phone: string | null;
    email: string | null;
    /** The address the table codes open and emails link to. */
    siteUrl: string | null;
    logoUrl: string | null;
    coverUrl: string | null;
    socialLinks: RestaurantSocialLink[];
    isPublished: boolean;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface UpdateRestaurantProfileRequest {
    slug: string;
    name: LocalizedText;
    tagline?: LocalizedText | null;
    about?: LocalizedText | null;
    currency: string;
    phone?: string | null;
    email?: string | null;
    siteUrl?: string | null;
    socialLinks?: RestaurantSocialLink[];
    isPublished: boolean;
}
