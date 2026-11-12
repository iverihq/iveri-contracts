/**
 * Where somebody stands with a course they were given, worked out from dates on every read and never stored, so
 * "expiring" is true the day it becomes true.
 */
export enum HrCourseAssignmentState {
    TO_DO = 'to-do',
    OVERDUE = 'overdue',
    DONE = 'done',
    EXPIRING = 'expiring',
    EXPIRED = 'expired',
}
