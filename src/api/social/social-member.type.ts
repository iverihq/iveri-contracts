import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { SocialFollowState } from './social-follow-state.enum.js';
import type { SocialMemberStatus } from './social-member-status.enum.js';

/** The smallest face of a person: what appears beside a post, a comment or a message. */
export interface SocialMemberCard {
    id: UUID;
    handle: string;
    displayName: string;
    avatarUrl: Nullable<string>;
    isPrivate: boolean;
}

export interface SocialRelationship {
    /** Whether the viewer follows this member. */
    following: SocialFollowState;
    /** Whether this member follows the viewer. */
    followedBy: SocialFollowState;
    isMuted: boolean;
    isBlocked: boolean;
}

export interface SocialProfile extends SocialMemberCard {
    bio: Nullable<string>;
    websiteUrl: Nullable<string>;
    followerCount: number;
    followingCount: number;
    postCount: number;
    joinedAt: IsoDateTime;
    isSelf: boolean;
    /** Absent for your own profile and for a visitor with no account. */
    relationship: Nullable<SocialRelationship>;
    /** False for a private account the viewer does not follow, whose posts stay out of reach. */
    canViewContent: boolean;
    hasStory: boolean;
}

/** A member reading about themselves. */
export interface SocialMe extends SocialProfile {
    status: SocialMemberStatus;
    suspendedUntil: Nullable<IsoDateTime>;
    /** The day this member turns 18. Absent for an adult. */
    minorUntil: Nullable<string>;
    isEmailConfirmed: boolean;
    deletionScheduledFor: Nullable<IsoDateTime>;
    acceptedTermsVersion: string;
    unreadActivityCount: number;
}

export interface CreateSocialProfileRequest {
    handle: string;
    displayName: string;
    /** `YYYY-MM-DD`. Checked and not stored. */
    birthDate: string;
    acceptedTermsVersion: string;
}

export interface UpdateSocialProfileRequest {
    handle?: string;
    displayName?: string;
    bio?: Nullable<string>;
    websiteUrl?: Nullable<string>;
    isPrivate?: boolean;
}

export interface SocialHandleAvailability {
    handle: string;
    isAvailable: boolean;
}

/** One line of a followers list, a following list or a follow-request list. */
export interface SocialMemberListItem {
    member: SocialMemberCard;
    relationship: Nullable<SocialRelationship>;
    since: IsoDateTime;
}

export interface SocialPreferences {
    emailOnFollow: boolean;
    emailOnMention: boolean;
    emailOnComment: boolean;
    /** Whether somebody you do not follow can start a conversation at all. */
    allowMessageRequests: boolean;
}
