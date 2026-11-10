import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { GymMediaImage } from './gym-common.type.js';

export interface GymSocialLinks {
    instagram: Nullable<string>;
    facebook: Nullable<string>;
    tiktok: Nullable<string>;
    whatsapp: Nullable<string>;
}

/** The rules a gym sets for its own timetable. */
export interface GymBookingPolicy {
    /** How many days ahead a member can book. */
    bookingHorizonDays: number;
    /** Cancelling later than this before a class keeps what the booking cost. */
    cancelCutoffMinutes: number;
    /** Nobody moves up from a waitlist closer than this to the start. */
    waitlistCutoffMinutes: number;
    /** How many upcoming places one member can hold at once. */
    maxActiveBookings: number;
    /** No-shows in the window that stop somebody booking. 0 means never. */
    noShowLimit: number;
    noShowWindowDays: number;
    noShowBlockDays: number;
}

export interface GymProfile {
    id: UUID;
    /** The name its public address and app build use. Unique across every gym. */
    slug: string;
    name: LocalizedText;
    tagline: Nullable<LocalizedText>;
    about: Nullable<LocalizedText>;
    socialLinks: Nullable<GymSocialLinks>;
    phone: Nullable<string>;
    email: Nullable<string>;
    /** The gym's public website, which the links in its emails point at. No path, no trailing slash. */
    siteUrl: Nullable<string>;
    logo: Nullable<GymMediaImage>;
    hero: Nullable<GymMediaImage>;
    /** Nothing about the gym is public until this is true. */
    isPublished: boolean;
    currency: string;
    /** How long a visit is taken to last when estimating how busy a branch is. */
    typicalVisitMinutes: number;
    policy: GymBookingPolicy;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface UpsertGymProfileRequest {
    slug: string;
    name: LocalizedText;
    tagline?: Nullable<LocalizedText>;
    about?: Nullable<LocalizedText>;
    socialLinks?: Nullable<GymSocialLinks>;
    phone?: Nullable<string>;
    email?: Nullable<string>;
    siteUrl?: Nullable<string>;
    logo?: Nullable<GymMediaImage>;
    hero?: Nullable<GymMediaImage>;
    isPublished?: boolean;
    currency?: string;
    typicalVisitMinutes?: number;
    policy?: Partial<GymBookingPolicy>;
}
