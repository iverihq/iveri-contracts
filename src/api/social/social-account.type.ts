import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { SocialExportStatus } from './social-export-status.enum.js';

export interface SocialDeletionState {
    deletionScheduledFor: Nullable<IsoDateTime>;
}

export interface SocialDataExport {
    id: UUID;
    status: SocialExportStatus;
    requestedAt: IsoDateTime;
    readyAt: Nullable<IsoDateTime>;
    expiresAt: Nullable<IsoDateTime>;
    downloadUrl: Nullable<string>;
    sizeBytes: Nullable<number>;
}

export interface ConfirmSocialEmailRequest {
    token: string;
}

export interface SocialRealtimeGrant {
    grant: string;
    expiresAt: IsoDateTime;
    memberId: UUID;
}
