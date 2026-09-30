/** Closed lifecycle owned by Mobility; vertical products never write this field directly. */
export enum MobilityDispatchStatus {
    PENDING = 'pending',
    SEARCHING = 'searching',
    OFFERED = 'offered',
    ASSIGNED = 'assigned',
    EXPIRED = 'expired',
    CANCELLED = 'cancelled',
    FAILED = 'failed',
}
