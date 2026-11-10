/** A bill is open until what it adds up to has been paid, or it is called off. */
export enum RestaurantBillStatus {
    OPEN = 'open',
    SETTLED = 'settled',
    CANCELLED = 'cancelled',
}
