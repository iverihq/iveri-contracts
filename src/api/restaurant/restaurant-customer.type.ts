import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';

/** Somebody who has ordered or booked. Staff book people who will never make an account. */
export interface RestaurantCustomer {
    id: UUID;
    userId: UUID | null;
    firstName: string;
    lastName: string;
    phone: string;
    email: string | null;
    localeCode: string | null;
    /** Null means nothing is sent to `email`, since anybody can register with an address not theirs. */
    emailConfirmedAt: IsoDateTime | null;
    orderCount: number;
    reservationCount: number;
    createdAt: IsoDateTime;
}

export interface SaveMyRestaurantCustomerRequest {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string | null;
    localeCode?: string | null;
}

export interface ConfirmRestaurantCustomerEmailRequest {
    token: string;
}
