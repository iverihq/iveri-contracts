/** Whose servers an app's own push credential talks to. */
export enum ChatPushCredentialKind {
    /** Apple Push Notification service, with the app's `.p8` key. */
    APNS = 'apns',
    /** Firebase Cloud Messaging, with the app's service account. */
    FCM = 'fcm',
}
