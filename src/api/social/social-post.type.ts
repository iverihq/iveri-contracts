import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { SocialImage } from './social-image.type.js';
import type { SocialMemberCard } from './social-member.type.js';

export interface SocialPost {
    id: UUID;
    author: SocialMemberCard;
    caption: Nullable<string>;
    images: SocialImage[];
    commentsDisabled: boolean;
    likeCount: number;
    commentCount: number;
    viewerLiked: boolean;
    viewerSaved: boolean;
    isOwn: boolean;
    createdAt: IsoDateTime;
    editedAt: Nullable<IsoDateTime>;
}

export interface CreateSocialPostMedia {
    id: UUID;
    altText?: Nullable<string>;
}

export interface CreateSocialPostRequest {
    caption?: Nullable<string>;
    media?: CreateSocialPostMedia[];
    commentsDisabled?: boolean;
}

export interface UpdateSocialPostRequest {
    caption?: Nullable<string>;
    commentsDisabled?: boolean;
}

export interface SocialComment {
    id: UUID;
    postId: UUID;
    parentId: Nullable<UUID>;
    author: SocialMemberCard;
    body: string;
    likeCount: number;
    replyCount: number;
    viewerLiked: boolean;
    isOwn: boolean;
    /** The commenter and the post's author may both delete it. */
    canDelete: boolean;
    createdAt: IsoDateTime;
}

export interface CreateSocialCommentRequest {
    body: string;
    parentId?: Nullable<UUID>;
}

export interface SocialTag {
    name: string;
    postCount: number;
}

export interface SocialSearchResults {
    members: SocialMemberCard[];
    tags: SocialTag[];
}
