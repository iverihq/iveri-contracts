/**
 * Every action a principal can be granted in an Iveri tenant, across every service.
 *
 * A permission is a **contract**, not an implementation detail: `iveri-identity-api` stores
 * members on role rows and resolves them into access tokens, every other service reads them
 * out of that token to authorize a request, and the frontend's `<RequirePermission>` branches
 * on the same values. A member's wire value therefore never changes, and a member is never
 * removed while issued tokens can still carry it — removing one silently downgrades every
 * live session holding it. Adding one is a minor version.
 *
 * **One catalogue for the whole platform, deliberately.** Identity validates custom-role input
 * against this list, so a permission it has never heard of cannot be granted. A service that
 * defined its own enum locally would find its permissions unassignable.
 *
 * Values are `<resource>:<action>` — or `<service>:<resource>:<action>` where a resource name
 * would otherwise collide across services — lowercase, so a token payload is readable in a
 * log and a wildcard match (`role:*`) stays possible if we ever need one.
 */
export enum UserPermission {
    // ══ iveri-identity-api ═══════════════════════════════════════════════════

    // ── Tenant ──────────────────────────────────────────────────────────────
    TENANT_READ = 'tenant:read',
    TENANT_UPDATE = 'tenant:update',
    /** Schedules the tenant for deletion. Owner-only; there is no undo path built yet. */
    TENANT_DELETE = 'tenant:delete',

    // ── User ────────────────────────────────────────────────────────────────
    USER_READ = 'user:read',
    USER_INVITE = 'user:invite',
    USER_UPDATE = 'user:update',
    USER_REMOVE = 'user:remove',

    // ── Membership ──────────────────────────────────────────────────────────
    MEMBERSHIP_READ = 'membership:read',
    /** Suspend or reactivate someone's access without deleting their account. */
    MEMBERSHIP_UPDATE = 'membership:update',
    /**
     * Change which roles a membership holds. Separate from `MEMBERSHIP_UPDATE` because
     * granting roles is privilege escalation and deserves its own gate.
     */
    MEMBERSHIP_ASSIGN_ROLE = 'membership:assign-role',

    // ── Role ────────────────────────────────────────────────────────────────
    ROLE_READ = 'role:read',
    ROLE_CREATE = 'role:create',
    ROLE_UPDATE = 'role:update',
    ROLE_DELETE = 'role:delete',

    // ── API key ─────────────────────────────────────────────────────────────
    API_KEY_READ = 'api-key:read',
    API_KEY_ISSUE = 'api-key:issue',
    API_KEY_REVOKE = 'api-key:revoke',

    // ══ conduit-api ══════════════════════════════════════════════════════════

    // ── Endpoint ────────────────────────────────────────────────────────────
    /** Read endpoint configuration. Never exposes the signing secret. */
    CONDUIT_ENDPOINT_READ = 'conduit:endpoint:read',
    CONDUIT_ENDPOINT_CREATE = 'conduit:endpoint:create',
    CONDUIT_ENDPOINT_UPDATE = 'conduit:endpoint:update',
    CONDUIT_ENDPOINT_DELETE = 'conduit:endpoint:delete',

    // ── Capture ─────────────────────────────────────────────────────────────
    /**
     * List and read captured requests, **including their raw bodies and headers**. Captures
     * hold whatever a provider sent — order details, message contents, personal data — so
     * this is closer to a data-export permission than a config one.
     */
    CONDUIT_CAPTURE_READ = 'conduit:capture:read',
    CONDUIT_CAPTURE_DELETE = 'conduit:capture:delete',

    // ── Replay ──────────────────────────────────────────────────────────────
    /**
     * Resend a captured request to an arbitrary URL. Separate from `CONDUIT_CAPTURE_READ`
     * because it makes an outbound request from our infrastructure with a body the caller
     * controls, which is a materially different power from reading a row.
     */
    CONDUIT_REPLAY_EXECUTE = 'conduit:replay:execute',

    // ── Provider ────────────────────────────────────────────────────────────
    CONDUIT_PROVIDER_READ = 'conduit:provider:read',
    /** Define or amend a custom provider manifest — signature scheme, headers, handshake. */
    CONDUIT_PROVIDER_MANAGE = 'conduit:provider:manage',

    // ── Destination (gateway mode) ──────────────────────────────────────────
    /** Read destinations. Never exposes their stored header values. */
    CONDUIT_DESTINATION_READ = 'conduit:destination:read',
    /**
     * Create, amend or delete a destination — **a URL Conduit will then post to on its own**,
     * repeatedly, from inside our network, carrying whatever a provider sent.
     *
     * Deliberately a single manage permission rather than create/update/delete: the dangerous
     * act is naming the URL at all, and splitting it would imply the three carry different
     * risk. They do not.
     */
    CONDUIT_DESTINATION_MANAGE = 'conduit:destination:manage',

    // ── Route (gateway mode) ────────────────────────────────────────────────
    CONDUIT_ROUTE_READ = 'conduit:route:read',
    /** Define which captures fan out to which destinations. */
    CONDUIT_ROUTE_MANAGE = 'conduit:route:manage',

    // ── Delivery (gateway mode) ─────────────────────────────────────────────
    /**
     * Read the delivery log and the dead-letter queue, including each attempt's response.
     *
     * Grouped with reading rather than with operating the queue: a delivery record holds a
     * target's response body, which can echo back the payload that was sent.
     */
    CONDUIT_DELIVERY_READ = 'conduit:delivery:read',
    /**
     * Redrive a dead-lettered delivery, or cancel one still pending.
     *
     * Separate from `CONDUIT_DELIVERY_READ` for the same reason replay is separate from capture
     * read: it causes an outbound request rather than returning a row, and redriving a large
     * dead-letter backlog is a way to flood a customer's own service.
     */
    CONDUIT_DELIVERY_OPERATE = 'conduit:delivery:operate',

    // ── Connector (outbound) ────────────────────────────────────────────────
    /** Read connector manifests. They hold no credential, so this is configuration only. */
    CONDUIT_CONNECTOR_READ = 'conduit:connector:read',
    /**
     * Define or amend a connector manifest — **the list of hosts and paths Conduit may be asked
     * to call**, and the token endpoint it will send a customer's client secret to.
     *
     * The most powerful permission in the outbound half. A dispatch cannot name a URL; it can
     * only name an operation somebody with this permission wrote down, which is what keeps
     * outbound from being an authenticated open proxy. Whoever holds this decides where the
     * proxy may point.
     */
    CONDUIT_CONNECTOR_MANAGE = 'conduit:connector:manage',

    // ── Connection (outbound) ───────────────────────────────────────────────
    /** Read connections. Never exposes their stored credential values. */
    CONDUIT_CONNECTION_READ = 'conduit:connection:read',
    /**
     * Create, amend or delete a connection — the customer's own third-party credentials.
     *
     * Single manage permission rather than create/update/delete: the dangerous act is holding
     * the credential at all, and the three carry the same risk.
     */
    CONDUIT_CONNECTION_MANAGE = 'conduit:connection:manage',

    // ── Dispatch (outbound) ─────────────────────────────────────────────────
    /**
     * Read the outbound log and its dead-letter queue, including each attempt's response.
     *
     * A dispatch record holds the payload a vertical asked to send — a customer's message text,
     * an order — so this is a data-read permission, not a config one.
     */
    CONDUIT_DISPATCH_READ = 'conduit:dispatch:read',
    /**
     * Submit an outbound request. **This is the permission a vertical holds**, and the only one
     * it needs: `unibox-api` sending a reply presents this and nothing else.
     *
     * Separate from `CONDUIT_DISPATCH_OPERATE` because sending is the routine act and operating
     * the queue is the exceptional one — a service principal that can send should not also be
     * able to redrive a backlog.
     */
    CONDUIT_DISPATCH_SEND = 'conduit:dispatch:send',
    /** Redrive a dead-lettered dispatch, or cancel one still pending. */
    CONDUIT_DISPATCH_OPERATE = 'conduit:dispatch:operate',

    // ══ commerce-api ═════════════════════════════════════════════════════════

    // ── Catalog ─────────────────────────────────────────────────────────────
    /** Read the tenant's product catalog, including prices and availability. */
    COMMERCE_CATALOG_READ = 'commerce:catalog:read',
    /** Create, edit, archive or restore products in the tenant's catalog. */
    COMMERCE_CATALOG_MANAGE = 'commerce:catalog:manage',

    // ══ iveri-messaging-api ═════════════════════════════════════════════════

    /** Read tenant message and provider-neutral delivery records. */
    MESSAGING_MESSAGE_READ = 'messaging:message:read',
    /** Submit a paid customer message for delivery. */
    MESSAGING_MESSAGE_SEND = 'messaging:message:send',
    /** Submit an OTP challenge message under the stricter OTP policy. */
    MESSAGING_OTP_SEND = 'messaging:otp:send',
    /** Read the tenant's available and reserved message-credit balance. */
    MESSAGING_CREDIT_READ = 'messaging:credit:read',
    /** Adjust or grant message credits; normally reserved for billing/platform workflows. */
    MESSAGING_CREDIT_MANAGE = 'messaging:credit:manage',

    // ══ unibox-api ═══════════════════════════════════════════════════════════

    // ── Channel ─────────────────────────────────────────────────────────────
    /** Read connected messaging accounts. Never exposes a channel's ingest secret. */
    UNIBOX_CHANNEL_READ = 'unibox:channel:read',
    /**
     * Connect, amend or disconnect a messaging account, and rotate its ingest secret.
     *
     * A single manage permission for the same reason as `CONDUIT_CONNECTION_MANAGE`: the
     * dangerous act is holding the credential that lets anything post messages into a tenant's
     * inbox, and create/update/delete carry that identically.
     */
    UNIBOX_CHANNEL_MANAGE = 'unibox:channel:manage',

    // ── Contact ─────────────────────────────────────────────────────────────
    /** Read contacts. Personal data — closer to a data-export permission than a config one. */
    UNIBOX_CONTACT_READ = 'unibox:contact:read',
    /** Create, amend or delete a contact record. */
    UNIBOX_CONTACT_MANAGE = 'unibox:contact:manage',

    // ── Conversation ────────────────────────────────────────────────────────
    /**
     * Read the inbox and every message in it.
     *
     * **There is deliberately no separate `unibox:message:read`.** A conversation with its
     * messages hidden is an empty row, so a permission that granted one without the other would
     * describe a screen nobody can use — and the reverse would be a way to read a customer's
     * messages while appearing to have no access to the inbox.
     */
    UNIBOX_CONVERSATION_READ = 'unibox:conversation:read',
    /** Change a conversation's status — close, snooze, reopen — and write internal notes. */
    UNIBOX_CONVERSATION_MANAGE = 'unibox:conversation:manage',
    /**
     * Assign a conversation to an agent or a team, and take over from the AI.
     *
     * Separate from `UNIBOX_CONVERSATION_MANAGE` because assignment decides whose work this is.
     * A supervisor routing a queue and an agent closing their own conversations are different
     * jobs, and a tenant that wants only the first to reassign should be able to say so.
     */
    UNIBOX_CONVERSATION_ASSIGN = 'unibox:conversation:assign',

    // ── Message ─────────────────────────────────────────────────────────────
    /**
     * Send a message to a contact.
     *
     * The sharpest permission in this service, and the reason there is no `unibox:message:*`
     * read counterpart. Everything else here moves rows around inside our own database; this one
     * reaches a real person on their phone, through a paid channel, and cannot be taken back.
     */
    UNIBOX_MESSAGE_SEND = 'unibox:message:send',

    // ── Team ────────────────────────────────────────────────────────────────
    UNIBOX_TEAM_READ = 'unibox:team:read',
    /** Create teams and change who is in them. Routing, not permissions — identity owns those. */
    UNIBOX_TEAM_MANAGE = 'unibox:team:manage',

    // ── Canned reply ────────────────────────────────────────────────────────
    UNIBOX_CANNED_REPLY_READ = 'unibox:canned-reply:read',
    /** Author the saved replies every agent in the tenant will send. */
    UNIBOX_CANNED_REPLY_MANAGE = 'unibox:canned-reply:manage',

    // ── Realtime ────────────────────────────────────────────────────────────
    /**
     * Publish a conversation event into the live inbox.
     *
     * **A service permission, not a human one**, and deliberately absent from the seeded `ADMIN`
     * role — unlike `CONDUIT_DISPATCH_SEND`, which an admin holds so they can prove a connection
     * works. There is no equivalent thing to prove here: publishing means putting a message in
     * front of every agent watching a conversation, so the only legitimate holder is the service
     * that owns what actually happened to that conversation.
     *
     * Reading the live stream is `UNIBOX_CONVERSATION_READ` — the same permission that guards
     * reading the inbox over HTTP, because it is the same data arriving by another route.
     */
    UNIBOX_REALTIME_PUBLISH = 'unibox:realtime:publish',

    // ── AI runtime ──────────────────────────────────────────────────────────
    /** Allows a trusted service principal to submit bounded conversation context for generation. */
    UNIBOX_AI_RUN = 'unibox:ai:run',

    // ── MCP registry ────────────────────────────────────────────────────────
    /** Read tenant MCP server metadata; credential values are never returned. */
    UNIBOX_MCP_READ = 'unibox:mcp:read',
    /** Create, update or disconnect a tenant MCP server. */
    UNIBOX_MCP_MANAGE = 'unibox:mcp:manage',

    // ══ iveri-billing-api ═══════════════════════════════════════════════════

    // ── Plan ───────────────────────────────────────────────────────────────
    /** Read the plans available to the tenant. */
    BILLING_PLAN_READ = 'billing:plan:read',
    /** Create, update or archive tenant billing plans. */
    BILLING_PLAN_MANAGE = 'billing:plan:manage',

    // ── Subscription ──────────────────────────────────────────────────────
    /** Read the tenant's current subscription and its period. */
    BILLING_SUBSCRIPTION_READ = 'billing:subscription:read',
    /** Start, change or cancel a tenant subscription. */
    BILLING_SUBSCRIPTION_MANAGE = 'billing:subscription:manage',

    // ── Usage ──────────────────────────────────────────────────────────────
    /** Read metered usage for the tenant. */
    BILLING_USAGE_READ = 'billing:usage:read',
    /** Record billable usage on behalf of a tenant service. */
    BILLING_USAGE_RECORD = 'billing:usage:record',

    // ── Payment ────────────────────────────────────────────────────────────
    /** Read payment sessions and their provider-neutral status. */
    BILLING_PAYMENT_READ = 'billing:payment:read',
    /** Create payment sessions and operate refunds or recurring authorizations. */
    BILLING_PAYMENT_MANAGE = 'billing:payment:manage',

    // ── Invoice ────────────────────────────────────────────────────────────
    /** Read tenant invoices and their immutable line items. */
    BILLING_INVOICE_READ = 'billing:invoice:read',
    /** Create, finalize or void tenant invoices. */
    BILLING_INVOICE_MANAGE = 'billing:invoice:manage',
}

/**
 * Every member, for seeding the owner role and validating custom-role input.
 *
 * Frozen because it is shared mutable state in a browser bundle otherwise: one caller sorting
 * it in place reorders it for everyone.
 */
export const ALL_USER_PERMISSIONS: readonly UserPermission[] = Object.freeze(Object.values(UserPermission));
