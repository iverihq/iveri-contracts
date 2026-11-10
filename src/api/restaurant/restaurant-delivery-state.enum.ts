/** Where a courier has got to. Null on an order means nobody has been asked. */
export enum RestaurantDeliveryState {
    SEARCHING = 'searching',
    COURIER_ASSIGNED = 'courier-assigned',
    PICKED_UP = 'picked-up',
    IN_TRANSIT = 'in-transit',
    DELIVERED = 'delivered',
    UNDELIVERABLE = 'undeliverable',
}
