import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { ClinicNewsletterChannel } from './clinic-newsletter-channel.enum.js';

export interface ClinicNewsletterSubscriber {
    id: UUID;
    channel: ClinicNewsletterChannel;
    address: string;
    localeCode: string;
    /** Always null for a phone. For an email, null until they have opened the link sent to it. */
    confirmedAt: Nullable<IsoDateTime>;
    consentedAt: IsoDateTime;
}

/** The newest subscribers, and how many there are in all. */
export interface ClinicNewsletterSubscriberList {
    total: number;
    items: ClinicNewsletterSubscriber[];
}

export interface SubscribeToClinicNewsletterRequest {
    email?: Nullable<string>;
    phone?: Nullable<string>;
    localeCode: string;
    /** Must be true. Nobody is added to a list without having said so. */
    hasConsent: boolean;
}
