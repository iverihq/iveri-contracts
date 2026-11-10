import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { RestaurantAllergen } from './restaurant-allergen.enum.js';
import type { RestaurantDietaryTag } from './restaurant-dietary-tag.enum.js';
import type { RestaurantResourceStatus } from './restaurant-resource-status.enum.js';

/** Where a plate is made: the hot kitchen, the bar. A ticket is what one station sees of an order. */
export interface RestaurantStation {
    id: UUID;
    name: LocalizedText;
    position: number;
    status: RestaurantResourceStatus;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateRestaurantStationRequest {
    name: LocalizedText;
    position?: number;
}

export interface UpdateRestaurantStationRequest {
    name?: LocalizedText;
    position?: number;
    status?: RestaurantResourceStatus;
}

export interface RestaurantMenuCategory {
    id: UUID;
    name: LocalizedText;
    description: LocalizedText | null;
    position: number;
    /** Wall-clock times in the branch's zone. Both null means all day. */
    availableFrom: string | null;
    availableUntil: string | null;
    status: RestaurantResourceStatus;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateRestaurantMenuCategoryRequest {
    name: LocalizedText;
    description?: LocalizedText | null;
    position?: number;
    availableFrom?: string | null;
    availableUntil?: string | null;
}

export interface UpdateRestaurantMenuCategoryRequest extends Partial<CreateRestaurantMenuCategoryRequest> {
    status?: RestaurantResourceStatus;
}

export interface RestaurantModifierOption {
    id: UUID;
    name: LocalizedText;
    /** Added to the item's price. May be negative. */
    priceDeltaMinor: number;
    position: number;
    status: RestaurantResourceStatus;
}

/**
 * A choice on a dish. Size is a group with exactly one pick and "extras" a group with none required,
 * so one mechanism covers both, and a group is shared by every dish that offers it.
 */
export interface RestaurantModifierGroup {
    id: UUID;
    name: LocalizedText;
    minSelections: number;
    maxSelections: number;
    status: RestaurantResourceStatus;
    options: RestaurantModifierOption[];
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface RestaurantModifierOptionInput {
    /** Present when keeping an option, so an order that names it still can. */
    id?: UUID;
    name: LocalizedText;
    priceDeltaMinor: number;
    status?: RestaurantResourceStatus;
}

export interface CreateRestaurantModifierGroupRequest {
    name: LocalizedText;
    minSelections: number;
    maxSelections: number;
    options: RestaurantModifierOptionInput[];
}

export interface UpdateRestaurantModifierGroupRequest extends Partial<CreateRestaurantModifierGroupRequest> {
    status?: RestaurantResourceStatus;
}

export interface RestaurantMenuItem {
    id: UUID;
    categoryId: UUID;
    stationId: UUID;
    name: LocalizedText;
    description: LocalizedText | null;
    priceMinor: number;
    imageUrl: string | null;
    thumbnailUrl: string | null;
    allergens: RestaurantAllergen[];
    dietaryTags: RestaurantDietaryTag[];
    prepMinutes: number | null;
    weightGrams: number | null;
    calories: number | null;
    isFeatured: boolean;
    position: number;
    status: RestaurantResourceStatus;
    /** In the order they are asked. */
    modifierGroupIds: UUID[];
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateRestaurantMenuItemRequest {
    categoryId: UUID;
    stationId: UUID;
    name: LocalizedText;
    description?: LocalizedText | null;
    priceMinor: number;
    allergens?: RestaurantAllergen[];
    dietaryTags?: RestaurantDietaryTag[];
    prepMinutes?: number | null;
    weightGrams?: number | null;
    calories?: number | null;
    isFeatured?: boolean;
    position?: number;
    modifierGroupIds?: UUID[];
}

export interface UpdateRestaurantMenuItemRequest extends Partial<CreateRestaurantMenuItemRequest> {
    status?: RestaurantResourceStatus;
}

/** How one branch differs from the menu. A row exists only where it does. */
export interface RestaurantBranchItem {
    itemId: UUID;
    branchId: UUID;
    isHidden: boolean;
    priceMinorOverride: number | null;
    /** Null is not sold out. A date in the far future is sold out until somebody says otherwise. */
    soldOutUntil: IsoDateTime | null;
}

export interface UpdateRestaurantBranchItemRequest {
    isHidden?: boolean;
    priceMinorOverride?: number | null;
}

/** Puts a dish on the stop-list. `end-of-day` ends with the branch's business day. */
export interface MarkRestaurantItemSoldOutRequest {
    until: 'end-of-day' | 'indefinite';
}
