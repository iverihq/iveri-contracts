/**
 * Where a licence stands, worked out from its dates on every read and never stored: one that has not started yet is
 * `scheduled`, one inside its dates is `active`, one past its last day is `expired`, and one Iveri called off is
 * `cancelled`. Only `active` opens the product.
 */
export enum LicenceStatus {
    SCHEDULED = 'scheduled',
    ACTIVE = 'active',
    EXPIRED = 'expired',
    CANCELLED = 'cancelled',
}
