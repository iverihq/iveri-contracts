/**
 * How a visit was paid for. The first three are money the clinic received.
 *
 * `course` and `bonus` settle a visit without any money changing hands that day, so a day's takings
 * keep them apart: the money for a course came in on the day it was sold.
 */
export enum ClinicPaymentMethod {
    CASH = 'cash',
    CARD = 'card',
    TRANSFER = 'transfer',
    COURSE = 'course',
    BONUS = 'bonus',
}
