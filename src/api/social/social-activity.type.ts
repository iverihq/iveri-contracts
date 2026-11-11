import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { SocialActivityKind } from './social-activity-kind.enum.js';
import type { SocialMemberCard } from './social-member.type.js';

/** One line of activity, which can stand for many people doing the same thing. */
export interface SocialActivityItem {
    id: UUID;
    kind: SocialActivityKind;
    /** The most recent few, for drawing faces and names. */
    actors: SocialMemberCard[];
    actorCount: number;
    postId: Nullable<UUID>;
    postThumbnailUrl: Nullable<string>;
    commentId: Nullable<UUID>;
    excerpt: Nullable<string>;
    /** For a moderation notice, the decision it announces. */
    noticeId: Nullable<UUID>;
    latestAt: IsoDateTime;
    isRead: boolean;
}

export interface SocialUnreadCounts {
    activity: number;
    followRequests: number;
}
