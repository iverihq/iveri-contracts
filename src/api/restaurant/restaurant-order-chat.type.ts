import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';

/** `POST /orders/:orderId/chat`: the conversation a member of staff just took up. */
export interface RestaurantOrderChat {
    conversationId: UUID;
}

/** `GET /orders/chat/me`: whether the caller answers diners, named in every order conversation. */
export interface RestaurantOrderChatStanding {
    hasJoined: boolean;
}

/** One person on the restaurant's side of every order conversation. */
export interface RestaurantOrderChatStaffMember {
    userId: UUID;
    /** As identity shows them to colleagues, or null when identity cannot name them. */
    displayName: string | null;
    isMe: boolean;
    joinedAt: IsoDateTime;
}

/** `GET /orders/chat/staff`: everybody who answers diners, in the order they took it up. */
export interface RestaurantOrderChatStaff {
    items: RestaurantOrderChatStaffMember[];
}
