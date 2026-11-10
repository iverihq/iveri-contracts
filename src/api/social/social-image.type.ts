import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

/** Addresses of one photograph. Signed, and only good for about two hours after the response. */
export interface SocialImageUrls {
    /** 320 wide. */
    small: string;
    /** 800 wide. */
    medium: string;
    /** 1600 wide. */
    large: string;
}

export interface SocialImage {
    id: UUID;
    width: number;
    height: number;
    /** A solid colour to paint while the photograph loads. */
    placeholderColor: string;
    altText: Nullable<string>;
    urls: SocialImageUrls;
}

/** What an upload answers, before anything has used it. */
export interface SocialMediaUpload {
    id: UUID;
    width: number;
    height: number;
    placeholderColor: string;
    previewUrl: string;
}
