export enum GymCheckInOutcome {
    ADMITTED = 'admitted',
    REFUSED = 'refused',
    /** Refused by the rules and let in by somebody who said why. */
    OVERRIDDEN = 'overridden',
}
