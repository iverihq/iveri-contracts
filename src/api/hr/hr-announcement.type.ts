import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

export interface HrAnnouncement {
    id: UUID;
    title: string;
    body: string;
    authorName: Nullable<string>;
    publishedAt: IsoDateTime;
}

export interface CreateHrAnnouncementRequest {
    title: string;
    body: string;
}
