/** What an app's server can be told about, through a webhook it registered. */
export enum ChatWebhookEvent {
    /** Somebody wrote in one of the app's conversations. A product's own notice is not one. */
    MESSAGE_CREATED = 'message.created',
    /** One of the app's users reported a message or a person. */
    REPORT_CREATED = 'report.created',
    /** A moderator warned, suspended or banned one of the app's users, or reinstated them. */
    PERSON_SANCTIONED = 'person.sanctioned',
}
