/** What kind of push token a device holds, which decides who delivers to it. */
export enum ChatPushTokenKind {
    /** An Expo push token, sent through Expo. What every Iveri app holds. */
    EXPO = 'expo',
    /** A raw APNs device token, sent through Apple with the app's own key. */
    APNS = 'apns',
    /** A raw FCM registration token, sent through Firebase with the app's own service account. */
    FCM = 'fcm',
}
