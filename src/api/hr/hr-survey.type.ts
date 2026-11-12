import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

import type { HrSurveyAudience } from './hr-survey-audience.enum.js';
import type { HrSurveyGroupKind } from './hr-survey-group-kind.enum.js';
import type { HrSurveyQuestionKind } from './hr-survey-question-kind.enum.js';
import type { HrSurveyState } from './hr-survey-state.enum.js';

export interface HrMySurvey {
    id: UUID;
    title: string;
    description: Nullable<string>;
    opensOn: string;
    closesOn: string;
    state: HrSurveyState;
    hasAnswered: boolean;
    questions: HrSurveyQuestion[];
}

export interface HrSurveyGroupResult {
    kind: HrSurveyGroupKind;
    id: UUID;
    name: string;
    /** False for a group too small to report, which then shows no count and no results. */
    isReportable: boolean;
    responseCount: Nullable<number>;
    questions: HrSurveyQuestionResult[];
}

export interface HrSurveyQuestion {
    id: UUID;
    position: number;
    kind: HrSurveyQuestionKind;
    prompt: string;
}

export interface HrSurveyQuestionResult {
    questionId: UUID;
    position: number;
    kind: HrSurveyQuestionKind;
    prompt: string;
    answerCount: number;
    /** Promoters' share minus detractors', -100 to 100, for an eNPS question. */
    enps: Nullable<number>;
    promoters: Nullable<number>;
    passives: Nullable<number>;
    detractors: Nullable<number>;
    /** A scale question's average, to one decimal place. */
    average: Nullable<number>;
    /** How many gave each score, from 0 for eNPS and from 1 for a scale. */
    distribution: Nullable<number[]>;
    /** Written answers in a random order. */
    texts: Nullable<string[]>;
}

export interface HrSurvey {
    id: UUID;
    title: string;
    description: Nullable<string>;
    audience: HrSurveyAudience;
    audienceId: Nullable<UUID>;
    audienceName: Nullable<string>;
    opensOn: string;
    closesOn: string;
    state: HrSurveyState;
    /** How many have answered. Who has is never shown. */
    responseCount: number;
    questions: HrSurveyQuestion[];
}

export interface HrSurveyResults {
    survey: HrSurvey;
    /** The smallest group reported on. */
    minimumGroup: number;
    responseCount: number;
    /** Who the survey asks, as the staff list stands today. */
    eligibleCount: number;
    /** False below the minimum, when nothing at all is shown. */
    isReportable: boolean;
    questions: HrSurveyQuestionResult[];
    /** Each department and team among the answers, reported only when big enough. */
    groups: HrSurveyGroupResult[];
}

export interface HrAnswerSurveyRequest {
    answers: HrSurveyAnswerRequest[];
}

export interface HrSaveSurveyRequest {
    title: string;
    description?: Nullable<string>;
    audience: HrSurveyAudience;
    /** The department or team, unless the survey asks everybody. */
    audienceId?: Nullable<UUID>;
    opensOn: string;
    closesOn: string;
    questions: HrSurveyQuestionRequest[];
}

export interface HrSurveyAnswerRequest {
    questionId: UUID;
    score?: Nullable<number>;
    text?: Nullable<string>;
}

export interface HrSurveyQuestionRequest {
    kind: HrSurveyQuestionKind;
    prompt: string;
}
