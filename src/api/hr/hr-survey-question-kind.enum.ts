/** How a survey question is answered. */
export enum HrSurveyQuestionKind {
    /** "How likely are you to recommend working here?", 0 to 10. */
    ENPS = 'enps',
    /** 1 to 5. */
    SCALE = 'scale',
    TEXT = 'text',
}
