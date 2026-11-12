/**
 * What a calendar subscription follows: a person's own time off, one of their teams, or the whole company.
 * Colleagues' entries say who and when, never which kind of leave.
 */
export enum HrCalendarFeedKind {
    MINE = 'mine',
    TEAM = 'team',
    COMPANY = 'company',
}
