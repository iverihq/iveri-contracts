import type { IsoDateTime } from '../../type/iso-date-time.type.js';

import type { ChatPushCredentialKind } from './chat-push-credential-kind.enum.js';

/** `GET /apps/:appId/push-credentials`: which kinds are set and since when. Never the key itself. */
export interface ChatAppPushCredential {
    kind: ChatPushCredentialKind;
    createdAt: IsoDateTime;
}

/** `PUT /apps/:appId/push-credentials/apns`. Replaces the app's APNs key. */
export interface PutChatApnsCredentialRequest {
    /** The ten-character key id Apple shows beside the `.p8`. */
    keyId: string;
    teamId: string;
    /** The app's bundle id, sent as `apns-topic`. */
    bundleId: string;
    /** The `.p8` file's contents, PEM. */
    privateKey: string;
    /** `true` sends to Apple's production service, `false` to its sandbox. */
    production: boolean;
}

/** `PUT /apps/:appId/push-credentials/fcm`. Replaces the app's Firebase service account. */
export interface PutChatFcmCredentialRequest {
    /** The service account's JSON key file, as text. */
    serviceAccountJson: string;
}
