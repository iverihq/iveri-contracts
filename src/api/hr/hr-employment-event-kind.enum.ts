export enum HrEmploymentEventKind {
    HIRED = 'hired',
    /** Their department, job title, location, manager or employment type changed. */
    JOB_CHANGED = 'job-changed',
    LEFT = 'left',
    /** A last day that was set has been withdrawn. */
    STAYED = 'stayed',
}
