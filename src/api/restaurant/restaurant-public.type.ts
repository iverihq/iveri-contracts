import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { RestaurantAllergen } from './restaurant-allergen.enum.js';
import type { RestaurantBillStatus } from './restaurant-bill-status.enum.js';
import type { RestaurantOpeningPeriod } from './restaurant-branch.type.js';
import type { RestaurantDietaryTag } from './restaurant-dietary-tag.enum.js';
import type { RestaurantLineStatus } from './restaurant-line-status.enum.js';
import type { RestaurantOrderStatus } from './restaurant-order-status.enum.js';
import type { RestaurantOrderLineOption, RestaurantOrderLineRequest } from './restaurant-order.type.js';
import type { RestaurantSocialLink } from './restaurant-profile.type.js';
import type { RestaurantServiceRequestKind } from './restaurant-service-request.type.js';

export interface PublicRestaurant {
    slug: string;
    name: LocalizedText;
    tagline: LocalizedText | null;
    about: LocalizedText | null;
    currency: string;
    phone: string | null;
    email: string | null;
    logoUrl: string | null;
    coverUrl: string | null;
    socialLinks: RestaurantSocialLink[];
    /** Without it a diner with no account cannot order, because they would have nothing to pay with. */
    acceptsOnlinePayment: boolean;
}

export interface PublicRestaurantBranch {
    id: UUID;
    name: LocalizedText;
    address: LocalizedText;
    city: LocalizedText;
    phone: string | null;
    latitude: number | null;
    longitude: number | null;
    timeZone: string;
    openingHours: RestaurantOpeningPeriod[];
    isOpenNow: boolean;
    dineInEnabled: boolean;
    takeawayEnabled: boolean;
    deliveryEnabled: boolean;
    reservationsEnabled: boolean;
    takeawayPrepMinutes: number;
    deliveryPrepMinutes: number;
    deliveryRadiusMeters: number;
    deliveryFeeMinor: number;
    deliveryMinimumOrderMinor: number;
    deliveryFreeOverMinor: number | null;
    serviceChargeBasisPoints: number;
    reservationMaxPartySize: number;
}

export interface PublicRestaurantModifierOption {
    id: UUID;
    name: LocalizedText;
    priceDeltaMinor: number;
}

export interface PublicRestaurantModifierGroup {
    id: UUID;
    name: LocalizedText;
    minSelections: number;
    maxSelections: number;
    options: PublicRestaurantModifierOption[];
}

export interface PublicRestaurantMenuItem {
    id: UUID;
    name: LocalizedText;
    description: LocalizedText | null;
    priceMinor: number;
    /** What a promotion running now makes it. Null when none applies. */
    discountedPriceMinor: number | null;
    imageUrl: string | null;
    thumbnailUrl: string | null;
    allergens: RestaurantAllergen[];
    dietaryTags: RestaurantDietaryTag[];
    weightGrams: number | null;
    calories: number | null;
    isFeatured: boolean;
    /** On the stop-list, or outside its category's hours. Shown and not orderable. */
    isAvailable: boolean;
    modifierGroups: PublicRestaurantModifierGroup[];
}

export interface PublicRestaurantMenuCategory {
    id: UUID;
    name: LocalizedText;
    description: LocalizedText | null;
    availableFrom: string | null;
    availableUntil: string | null;
    items: PublicRestaurantMenuItem[];
}

export interface PublicRestaurantMenu {
    branchId: UUID;
    currency: string;
    categories: PublicRestaurantMenuCategory[];
}

/** What the table code opens. */
export interface PublicRestaurantTable {
    label: string;
    seats: number;
    branch: PublicRestaurantBranch;
}

export interface PublicRestaurantTableOrderRequest {
    lines: RestaurantOrderLineRequest[];
    note?: string | null;
}

export interface PublicRestaurantTableOrderLine {
    id: UUID;
    name: LocalizedText;
    quantity: number;
    lineTotalMinor: number;
    options: RestaurantOrderLineOption[];
    note: string | null;
    status: RestaurantLineStatus;
}

export interface PublicRestaurantTableOrder {
    id: UUID;
    number: number;
    status: RestaurantOrderStatus;
    placedAt: string;
    lines: PublicRestaurantTableOrderLine[];
}

/** A table's bill as anyone holding the code can read it: dishes and prices, and no names. */
export interface PublicRestaurantTableBill {
    status: RestaurantBillStatus;
    currency: string;
    subtotalMinor: number;
    serviceChargeBasisPoints: number;
    serviceChargeMinor: number;
    totalMinor: number;
    paidMinor: number;
    balanceMinor: number;
    orders: PublicRestaurantTableOrder[];
    openRequests: RestaurantServiceRequestKind[];
}

/** What a table has at the moment. No open bill is an ordinary answer: nobody has ordered yet. */
export interface PublicRestaurantTableState {
    bill: PublicRestaurantTableBill | null;
}

export interface PublicRestaurantServiceRequestBody {
    kind: RestaurantServiceRequestKind;
}
