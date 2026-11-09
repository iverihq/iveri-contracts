import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { LocalizedText } from './localized-text.type.js';

/** How a clinic presents itself to the public, and the rules for booking online. */
export interface ClinicProfile {
    id: UUID;
    /** The name its public address and app build use. Unique across every clinic. */
    slug: string;
    name: LocalizedText;
    tagline: Nullable<LocalizedText>;
    phone: Nullable<string>;
    email: Nullable<string>;
    /** The clinic's public website, which the links in its emails point at. No path, no trailing slash. */
    siteUrl: Nullable<string>;
    /** Nothing about the clinic is public until this is true. */
    isPublished: boolean;
    /** How long before a booking a client can still cancel it themselves. */
    clientCancelCutoffHours: number;
    /** How far ahead a client can book. */
    bookingHorizonDays: number;
    /** The share of money paid that comes back as bonus. Zero means the clinic runs no bonus programme. */
    bonusEarnPercent: number;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface SaveClinicProfileRequest {
    slug: string;
    name: LocalizedText;
    tagline?: Nullable<LocalizedText>;
    phone?: Nullable<string>;
    email?: Nullable<string>;
    siteUrl?: Nullable<string>;
    isPublished: boolean;
    clientCancelCutoffHours: number;
    bookingHorizonDays: number;
    bonusEarnPercent?: number;
}
