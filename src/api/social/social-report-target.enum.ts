/**
 * The kinds of thing a member can report.
 *
 * A message is reported to Baasi, which holds it, and lands in Baasi's queue for Ezo's tenant.
 */
export enum SocialReportTarget {
    POST = 'post',
    COMMENT = 'comment',
    STORY = 'story',
    MEMBER = 'member',
}
