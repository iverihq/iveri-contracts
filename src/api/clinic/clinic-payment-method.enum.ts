/**
 * How a visit was paid for. `cash`, `card`, `transfer` and `online` are money the clinic received.
 *
 * `online` is a deposit a client paid on the bank's hosted page when they booked. Nobody at the desk
 * recorded it, so its line names no person.
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
    ONLINE = 'online',
}
