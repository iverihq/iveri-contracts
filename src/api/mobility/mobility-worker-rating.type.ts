import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { UUID } from '../../type/uuid.type.js';

/**
 * What one customer thought of one job a worker did.
 *
 * **Mobility owns a worker's reputation because a worker is Mobility's aggregate**, and one
 * person enrolled for both capabilities has one reputation rather than a taxi one and a delivery
 * one. The products own who may rate and when — the passenger on a completed ride, the sender on
 * a delivered job — and submit the result here with their own service credential, which is the
 * same direction of knowledge as dispatch itself.
 *
 * **There is deliberately no comment field.** A free-text comment about a named person needs a
 * reader, a way for that person to contest it and a retention window, and none of those is an
 * engineering decision. A score with none of them is a number; a comment with none of them is an
 * unreviewed, permanent, unanswerable accusation.
 */
export interface MobilityWorkerRating {
    id: UUID;

    /**
     * The assignment being rated, which is also what makes a rating unique.
     *
     * The caller names the **assignment** rather than the worker, so a product that rated the
     * wrong person would have to have been given the wrong job — Mobility resolves the worker
     * from the row it already holds. An assignment has exactly one customer, so one rating per
     * assignment is a database constraint rather than a rule each product repeats.
     */
    assignmentId: UUID;

    workerId: UUID;

    /** 1 to 5, whole numbers. Halves invite an argument about what 3.5 means. */
    score: number;

    createdAt: IsoDateTime;
}

/**
 * `POST /api/v1/worker-ratings`, behind `mobility:worker:rating:submit`.
 *
 * No `Idempotency-Key` header: `assignmentId` is a better key than one a caller invents, because
 * it is the thing that must not be rated twice. A replay returns the stored rating rather than a
 * conflict, so a product retrying a timed-out submit does not have to special-case its own retry.
 */
export interface SubmitMobilityWorkerRatingBody {
    assignmentId: UUID;

    score: number;

    /**
     * The person whose opinion this is.
     *
     * Stored so a disputed rating can be investigated at all, and supplied by the product
     * because only the product knows who was on that ride. It is never published: a worker
     * learning which customer scored them one star is how a rating becomes a reprisal.
     */
    ratedByUserId: UUID;
}

export interface SubmitMobilityWorkerRatingResponse {
    rating: MobilityWorkerRating;

    /** True where this assignment had already been rated; the stored rating is returned. */
    isDuplicate: boolean;
}

/**
 * A worker's standing, as anybody deciding whether to get into their car may see it.
 *
 * `ratingAverage` is **null until there are enough ratings to mean anything**, which is a
 * different fact from a low score and must not render as one. A worker whose first customer gave
 * them one star is not a one-star worker, and a platform that says they are has made one bad day
 * permanent. Clients render the null as "new" rather than as a figure.
 */
export interface MobilityWorkerReputation {
    /** Mean of every score, to one decimal place, or null below the publication threshold. */
    ratingAverage: Nullable<number>;

    /** How many ratings there are, published whether or not the average is. */
    ratingCount: number;
}
