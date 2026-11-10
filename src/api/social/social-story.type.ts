import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { SocialImage } from './social-image.type.js';
import type { SocialMemberCard } from './social-member.type.js';

export interface SocialStory {
    id: UUID;
    image: SocialImage;
    caption: Nullable<string>;
    createdAt: IsoDateTime;
    expiresAt: IsoDateTime;
    viewerSeen: boolean;
    /** Only the author is told. */
    viewCount: Nullable<number>;
}

/** Everything one person has up today. */
export interface SocialStoryReel {
    author: SocialMemberCard;
    stories: SocialStory[];
    hasUnseen: boolean;
}

export interface CreateSocialStoryRequest {
    mediaId: UUID;
    caption?: Nullable<string>;
    altText?: Nullable<string>;
}

export interface SocialStoryViewer {
    member: SocialMemberCard;
    viewedAt: IsoDateTime;
}
