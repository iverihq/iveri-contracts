import type { IsoDateTime } from '../../type/iso-date-time.type.js';
import type { Nullable } from '../../type/nil.type.js';
import type { Paginated } from '../../type/paginated.type.js';
import type { UUID } from '../../type/uuid.type.js';
import type { TenantStatus } from '../identity/tenant-status.enum.js';

import type { IveriProduct } from './iveri-product.enum.js';
import type { LicenceKind } from './licence-kind.enum.js';
import type { LicenceStatus } from './licence-status.enum.js';

/** A company on Iveri, as Iveri's operators see it. Nothing about its people beyond a count and who owns it. */
export interface PlatformTenant {
    id: UUID;
    name: string;
    slug: string;
    status: TenantStatus;
    /** Why it was last suspended or reactivated, as the operator wrote it. */
    statusReason: Nullable<string>;
    statusChangedAt: Nullable<IsoDateTime>;
    /** People with an active or invited membership. */
    memberCount: number;
    ownerName: Nullable<string>;
    ownerEmail: Nullable<string>;
    createdAt: IsoDateTime;
}

export type PlatformTenantsPage = Paginated<PlatformTenant>;

/** Adds a company with its first owner, who is invited rather than given a password. */
export interface CreatePlatformTenantRequest {
    name: string;
    slug: string;
    ownerEmail: string;
    ownerFirstName: string;
    ownerLastName: string;
}

/**
 * The new company and the owner's invitation. The token is shown to the operator once, to pass on, because no email
 * can be sent for a company from outside it yet.
 */
export interface CreatedPlatformTenant {
    tenant: PlatformTenant;
    ownerInvitationToken: string;
}

/** Suspend or reactivate a company. The reason is required, because it is what the next operator reads. */
export interface UpdatePlatformTenantStatusRequest {
    status: TenantStatus.ACTIVE | TenantStatus.SUSPENDED;
    reason: string;
}

/** A company's licence for one product. Its dates are calendar days in UTC, the last day included. */
export interface ProductLicence {
    id: UUID;
    tenantId: UUID;
    product: IveriProduct;
    kind: LicenceKind;
    /** How many people may be on the product's staff list at once, or null for no limit. */
    seats: Nullable<number>;
    startsOn: string;
    /** The last day it covers, or null when it runs until cancelled. */
    endsOn: Nullable<string>;
    status: LicenceStatus;
    note: Nullable<string>;
    cancelledAt: Nullable<IsoDateTime>;
    createdAt: IsoDateTime;
    updatedAt: IsoDateTime;
}

export interface CreateProductLicenceRequest {
    tenantId: UUID;
    product: IveriProduct;
    kind: LicenceKind;
    seats?: Nullable<number>;
    startsOn: string;
    endsOn?: Nullable<string>;
    note?: Nullable<string>;
}

/** Renewing is moving `endsOn`; turning a trial into a paid licence is changing `kind`. */
export interface UpdateProductLicenceRequest {
    kind?: LicenceKind;
    seats?: Nullable<number>;
    endsOn?: Nullable<string>;
    note?: Nullable<string>;
}

/**
 * What a product is told about one company's licence for it. A company with no licence at all reads as not active,
 * with every other field null.
 */
export interface ProductLicenceCheck {
    tenantId: UUID;
    product: IveriProduct;
    isActive: boolean;
    status: Nullable<LicenceStatus>;
    seats: Nullable<number>;
    endsOn: Nullable<string>;
}

/**
 * Carried in the `details` of the 403 a product answers when the company's licence for it is not live, so an app can
 * show "your company's licence has ended" rather than a bare refusal. Seats running out is an ordinary 409 instead,
 * because it refuses one action rather than the whole product.
 */
export const LICENCE_INACTIVE_REASON = 'licence-inactive';

export interface LicenceInactiveDetails {
    reason: typeof LICENCE_INACTIVE_REASON;
    product: IveriProduct;
}
