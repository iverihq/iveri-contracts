/** One picture, as a browser fetches it. */
export interface GymMediaImage {
    url: string;
    thumbnailUrl: string;
}

/** A stretch of one weekday, in the branch's own wall-clock time. */
export interface GymWeeklyPeriod {
    /** ISO weekday: 1 is Monday and 7 is Sunday. */
    dayOfWeek: number;
    /** 24-hour `HH:mm`. */
    startTime: string;
    /** 24-hour `HH:mm`, later than `startTime`. */
    endTime: string;
}
