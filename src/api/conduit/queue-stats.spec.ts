import { DeliveryStatus } from './delivery-status.enum.js';
import { DispatchStatus } from './dispatch-status.enum.js';

/**
 * Which half of the stats each status is counted in.
 *
 * `DeliveryStats` and `DispatchStats` name their fields rather than carrying a map keyed by
 * status, which reads as a simplification and is the one thing about them that can go silently
 * wrong: a status added to the enum is a status no field counts, and the dashboard then omits a
 * whole class of row while looking complete.
 *
 * These tables are **`Record`s over the enum**, so a sixth member is a compile error here rather
 * than a number nobody notices is missing. They live in the contract because every client has to
 * decide the same thing — see the `isSettled` table in `conduit-admin-web`, which makes exactly
 * this split for the badge beside these counts.
 */
type StatsRole =
    /** Counted in `backlog`, over all time, because something is still owed. */
    | 'backlog'
    /** Counted in `recent`, over the window, because it is an outcome. */
    | 'throughput'
    /** Counted in neither, with a reason. */
    | 'omitted';

const DELIVERY_ROLE: Readonly<Record<DeliveryStatus, StatsRole>> = {
    [DeliveryStatus.PENDING]: 'backlog',
    [DeliveryStatus.IN_FLIGHT]: 'backlog',

    /**
     * Both halves: a dead letter is owed for ever until somebody acts, *and* it is the failure
     * half of the success rate. The two numbers answer different questions and differ in
     * practice — a workspace that cleared its backlog yesterday reads 0 in one and non-zero in
     * the other.
     */
    [DeliveryStatus.DEAD_LETTERED]: 'backlog',

    [DeliveryStatus.DELIVERED]: 'throughput',

    /**
     * Neither. Cancelling is an operator's decision, so counting it as a failure would make a
     * tidied-up queue look like a broken one — the same reason the badge paints it neutral.
     */
    [DeliveryStatus.CANCELLED]: 'omitted',
};

const DISPATCH_ROLE: Readonly<Record<DispatchStatus, StatsRole>> = {
    [DispatchStatus.PENDING]: 'backlog',
    [DispatchStatus.IN_FLIGHT]: 'backlog',
    [DispatchStatus.DEAD_LETTERED]: 'backlog',
    [DispatchStatus.DELIVERED]: 'throughput',
    [DispatchStatus.CANCELLED]: 'omitted',
};

describe('queue stats coverage', () => {
    /*
     * There is deliberately no test that every status appears in the tables above. Both are
     * `Record`s over their enum, so a member added without a role is a **compile** error — and a
     * runtime assertion over a full `Record` cannot fail, which would make it a green test that
     * asserts nothing.
     */

    /**
     * The three `backlog` fields, named. A status becoming backlog without a field to hold it is
     * the failure these tables exist to catch, and the field list is the other half of it.
     */
    it('has a backlog field for each status in the backlog', () => {
        const backlog = Object.values(DeliveryStatus).filter((status) => DELIVERY_ROLE[status] === 'backlog');

        expect(backlog).toEqual([DeliveryStatus.PENDING, DeliveryStatus.IN_FLIGHT, DeliveryStatus.DEAD_LETTERED]);
    });

    /** Inbound and outbound split the statuses identically, so a client can share the mapping. */
    it('splits dispatch statuses exactly as delivery statuses', () => {
        const byValue = (role: Readonly<Record<string, StatsRole>>): Record<string, StatsRole> =>
            Object.fromEntries(Object.entries(role).sort(([a], [b]) => a.localeCompare(b)));

        expect(byValue(DISPATCH_ROLE)).toEqual(byValue(DELIVERY_ROLE));
    });
});
