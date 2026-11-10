import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { LocalizedText } from '../clinic/localized-text.type.js';

import type { GymEquipment } from './gym-equipment.enum.js';
import type { GymExerciseCategory } from './gym-exercise-category.enum.js';
import type { GymExerciseMeasure } from './gym-exercise-measure.enum.js';
import type { GymMuscleGroup } from './gym-muscle-group.enum.js';
import type { GymRecordKind } from './gym-record-kind.enum.js';
import type { GymResourceStatus } from './gym-resource-status.enum.js';

export interface GymExercise {
    id: UUID;
    name: LocalizedText;
    category: GymExerciseCategory;
    muscleGroup: GymMuscleGroup;
    equipment: GymEquipment;
    measure: GymExerciseMeasure;
    instructions: Nullable<LocalizedText>;
    status: GymResourceStatus;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateGymExerciseRequest {
    name: LocalizedText;
    category: GymExerciseCategory;
    muscleGroup: GymMuscleGroup;
    equipment: GymEquipment;
    measure: GymExerciseMeasure;
    instructions?: Nullable<LocalizedText>;
}

export type UpdateGymExerciseRequest = Partial<CreateGymExerciseRequest> & { status?: GymResourceStatus };

export interface GymRoutineItem {
    exerciseId: UUID;
    exerciseName: LocalizedText;
    measure: GymExerciseMeasure;
    sets: number;
    reps: Nullable<number>;
    targetWeightGrams: Nullable<number>;
    targetSeconds: Nullable<number>;
    restSeconds: Nullable<number>;
    note: Nullable<string>;
}

export interface GymRoutine {
    id: UUID;
    /** Null for a routine the gym keeps to hand out. */
    memberId: Nullable<UUID>;
    name: string;
    note: Nullable<string>;
    /** Who wrote it, when a trainer did. */
    assignedByName: Nullable<string>;
    items: GymRoutineItem[];
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface GymRoutineItemInput {
    exerciseId: UUID;
    sets: number;
    reps?: Nullable<number>;
    targetWeightGrams?: Nullable<number>;
    targetSeconds?: Nullable<number>;
    restSeconds?: Nullable<number>;
    note?: Nullable<string>;
}

export interface SaveGymRoutineRequest {
    name: string;
    note?: Nullable<string>;
    items: GymRoutineItemInput[];
}

export interface AssignGymRoutineRequest {
    memberId: UUID;
}

export interface GymWorkoutSetInput {
    exerciseId: UUID;
    reps?: Nullable<number>;
    weightGrams?: Nullable<number>;
    durationSeconds?: Nullable<number>;
    distanceMeters?: Nullable<number>;
    isWarmup?: boolean;
}

/** Written on the phone and sent whole when it ends. The id is made there and is the idempotency key. */
export interface SaveGymWorkoutRequest {
    id: UUID;
    title: string;
    routineId?: Nullable<UUID>;
    startedAt: IsoDateTime;
    finishedAt: IsoDateTime;
    note?: Nullable<string>;
    sets: GymWorkoutSetInput[];
}

export interface GymWorkoutSet {
    exerciseId: UUID;
    exerciseName: LocalizedText;
    measure: GymExerciseMeasure;
    position: number;
    reps: Nullable<number>;
    weightGrams: Nullable<number>;
    durationSeconds: Nullable<number>;
    distanceMeters: Nullable<number>;
    isWarmup: boolean;
}

export interface GymPersonalRecord {
    exerciseId: UUID;
    exerciseName: LocalizedText;
    kind: GymRecordKind;
    /** Grams, repetitions, seconds or metres, as `kind` says. */
    value: number;
    achievedAt: IsoDateTime;
    workoutId: UUID;
}

export interface GymWorkoutSummary {
    id: UUID;
    title: string;
    startedAt: IsoDateTime;
    finishedAt: IsoDateTime;
    durationSeconds: number;
    exerciseCount: number;
    setCount: number;
    volumeGrams: number;
}

export interface GymWorkout extends GymWorkoutSummary {
    routineId: Nullable<UUID>;
    note: Nullable<string>;
    sets: GymWorkoutSet[];
    /** The records this workout set. */
    records: GymPersonalRecord[];
}

/** A person's body, so a trainer and the member can read it and the front desk cannot. */
export interface GymMeasurement {
    id: UUID;
    takenOn: string;
    weightGrams: Nullable<number>;
    bodyFatPercentTenths: Nullable<number>;
    chestMm: Nullable<number>;
    waistMm: Nullable<number>;
    hipsMm: Nullable<number>;
    armMm: Nullable<number>;
    thighMm: Nullable<number>;
    note: Nullable<string>;
    createdAt: IsoDateTime;
}

export interface SaveGymMeasurementRequest {
    takenOn: string;
    weightGrams?: Nullable<number>;
    bodyFatPercentTenths?: Nullable<number>;
    chestMm?: Nullable<number>;
    waistMm?: Nullable<number>;
    hipsMm?: Nullable<number>;
    armMm?: Nullable<number>;
    thighMm?: Nullable<number>;
    note?: Nullable<string>;
}

export interface GymStreakWeek {
    /** The Monday that begins it. */
    weekStart: string;
    days: number;
    reachedTarget: boolean;
    /** The whole week fell inside a freeze, so it neither counts nor breaks the streak. */
    wasFrozen: boolean;
}

/** Weeks in a row a member reached their own target, counting a door visit or a workout once per day. */
export interface GymStreak {
    currentWeeks: number;
    bestWeeks: number;
    weeklyTarget: number;
    daysThisWeek: number;
    /** The last twelve weeks, oldest first. */
    weeks: GymStreakWeek[];
}

export interface SetGymWeeklyTargetRequest {
    weeklyTarget: number;
}

export interface GymTrainingSummary {
    streak: GymStreak;
    workoutsThisMonth: number;
    volumeGramsThisMonth: number;
    latestRecords: GymPersonalRecord[];
}
