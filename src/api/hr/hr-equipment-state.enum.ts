/**
 * Where an item is. `assigned` is worked out from an open hand-over and never stored, so a row cannot say somebody
 * holds a thing nobody was handed.
 */
export enum HrEquipmentState {
    AVAILABLE = 'available',
    ASSIGNED = 'assigned',
    IN_REPAIR = 'in-repair',
    RETIRED = 'retired',
}
