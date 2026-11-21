/**
 * Where the online deposit for a visit stands.
 *
 * It is its own field rather than a member of the appointment's status, because a visit can be
 * **cancelled and paid**: the slot is released when a payment window runs out, and the money can land a
 * moment later. One enum would have to drop one of those two facts, and the clinic needs both to give
 * the money back.
 *
 * - `not_required`: nothing was asked for online. Every visit booked at the desk, and any treatment
 *   with no deposit.
 * - `pending`: the slot is held while the client pays, until `depositExpiresAt`.
 * - `paid`: the money arrived and is a line in the clinic's ledger.
 * - `failed`: the bank refused it, and the slot was released.
 * - `expired`: nobody paid in time, and the slot was released.
 */
export enum ClinicDepositStatus {
    NOT_REQUIRED = 'not_required',
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    EXPIRED = 'expired',
}
