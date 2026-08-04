import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { Paginated } from '../../type/paginated.type.js';
import type { UUID } from '../../type/uuid.type.js';

/**
 * A group of agents work is routed to — Support, Sales, Billing.
 *
 * **A team is not a role and not a membership.** Identity owns who exists and what they may do;
 * this owns who is expected to answer what. Keeping them apart is what lets an agent be moved
 * between teams without touching their permissions, which is the operation that actually happens
 * weekly.
 *
 * `memberUserIds` names users in `iveri-identity-api`, so it is a loose reference with no foreign
 * key. A user removed there leaves a stale id here; Unibox filters those out when resolving a
 * team rather than pretending it can prevent them.
 */
export interface Team {
    id: UUID;

    name: string;

    description: Nullable<string>;

    /** Identity user ids. Order is not meaningful. */
    memberUserIds: UUID[];

    /**
     * Conversations on these channels are routed to this team when nothing else claims them.
     *
     * Empty means the team takes no automatic routing and is assignment-only. Deliberately a list
     * on the team rather than a team id on the channel: a channel routed to two teams during a
     * handover period is a real thing customers ask for, and the other direction cannot express it.
     */
    channelIds: UUID[];

    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

/** `GET /api/v1/teams`. Offset-paged; a tenant has a handful. */
export type TeamsPage = Paginated<Team>;

/** `POST /api/v1/teams`. */
export interface CreateTeamBody {
    name: string;
    description?: Nullable<string>;
    memberUserIds?: Nullable<UUID[]>;
    channelIds?: Nullable<UUID[]>;
}

/** `PATCH /api/v1/teams/:id`. Both id lists replace wholesale; omit to leave alone, `[]` clears. */
export interface UpdateTeamBody {
    name?: string;
    description?: Nullable<string>;
    memberUserIds?: Nullable<UUID[]>;
    channelIds?: Nullable<UUID[]>;
}
