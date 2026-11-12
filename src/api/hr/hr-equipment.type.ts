import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrEquipmentCategory } from './hr-equipment-category.enum.js';
import type { HrEquipmentState } from './hr-equipment-state.enum.js';

export interface HrEquipmentAssignment {
    id: UUID;
    itemId: UUID;
    itemName: string;
    itemCategory: HrEquipmentCategory;
    serialNumber: Nullable<string>;
    employeeId: UUID;
    employeeName: string;
    /** The holder's last day, set when they are leaving. */
    employeeLastDay: Nullable<string>;
    assignedOn: string;
    assignedCondition: Nullable<string>;
    receivedConfirmedAt: Nullable<IsoDateTime>;
    /** Null while it is still with them. */
    returnedOn: Nullable<string>;
    returnedCondition: Nullable<string>;
}

export interface HrEquipmentItemDetail {
    item: HrEquipmentItem;
    /** Every hand-over, newest first. */
    history: HrEquipmentAssignment[];
}

export interface HrEquipmentItem {
    id: UUID;
    name: string;
    category: HrEquipmentCategory;
    serialNumber: Nullable<string>;
    purchasedOn: Nullable<string>;
    purchaseCostMinor: Nullable<number>;
    currency: Nullable<string>;
    /** `assigned` while a hand-over is open, otherwise what HR last said about the item. */
    state: HrEquipmentState;
    notes: Nullable<string>;
    holderEmployeeId: Nullable<UUID>;
    holderName: Nullable<string>;
    heldSince: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface HrAssignEquipmentRequest {
    employeeId: UUID;
    assignedOn: string;
    condition?: Nullable<string>;
}

export interface HrReturnEquipmentRequest {
    returnedOn: string;
    condition?: Nullable<string>;
    status?: HrEquipmentState;
}

export interface HrSaveEquipmentItemRequest {
    name: string;
    category: HrEquipmentCategory;
    serialNumber?: Nullable<string>;
    purchasedOn?: Nullable<string>;
    /** In minor units of the company's currency. */
    purchaseCostMinor?: Nullable<number>;
    notes?: Nullable<string>;
}

export interface UpdateHrEquipmentItemRequest {
    name?: string;
    category?: HrEquipmentCategory;
    serialNumber?: Nullable<string>;
    purchasedOn?: Nullable<string>;
    purchaseCostMinor?: Nullable<number>;
    notes?: Nullable<string>;
    status?: HrEquipmentState;
}
