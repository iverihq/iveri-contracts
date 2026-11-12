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

    // ── Profile ─────────────────────────────────────────────────────────────
    /**
     * Read the **public** half of somebody else's profile — a display name and a photo, and
     * nothing else.
     *
     * Deliberately not `USER_READ`, which returns an email, a membership and a role list for
     * every person in the tenant. The thing a passenger needs is the face of the driver coming
     * to collect them, and the thing a merchant needs is the name of the courier at their door;
     * granting a tenant-wide user read to answer that would hand a phone the staff directory.
     *
     * A person always reads their **own** profile through `GET /auth/me`, which needs no
     * permission at all — it is the subject of the presented token.
     */
    PROFILE_READ = 'profile:read',

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

    // ── Shopper orders ──────────────────────────────────────────────────────
    //
    // Separate from the catalog pair because of **who holds them**: `storefront-api` answers the
    // public internet on a merchant's behalf, and it has to be able to place an order without
    // being able to delete the merchant's products. `commerce:catalog:manage` covers both, so
    // granting it to that service would put a catalogue edit one bug away from a shopfront.
    //
    // The merchant's own `/orders` routes still carry `commerce:catalog:*`. Moving them here is
    // the right follow-up and is **not** a decorator change: `OWNER` is derived from
    // `ALL_USER_PERMISSIONS` *at seed time*, so a tenant that already exists would not hold these
    // and its owner would lose access to their own orders. It needs a backfill first.
    /** Read orders a shopper placed, scoped to that shopper by the caller. */
    COMMERCE_ORDER_READ = 'commerce:order:read',
    /** Place an order on a shopper's behalf. Does not permit any catalog change. */
    COMMERCE_ORDER_CREATE = 'commerce:order:create',

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
    /**
     * Start a hosted payment. **Separate from `manage` because of what `manage` also covers:**
     * issuing a refund, charging a saved card through a recurring authorization, and writing a
     * tenant's encrypted merchant credentials. Three very different blast radii behind one grant,
     * which `iveri-billing-api`'s authorization matrix has recorded as a gap since it was written.
     *
     * A vertical that sells something needs exactly one of those four things. `commerce-api` holds
     * this so a shopper's order can be paid for, and holding it does not let Commerce move money
     * back out, charge a card again, or read a credential.
     *
     * It does not carry a read: `billing:payment:read` still opens the status route, and that read
     * is tenant-wide because **billing records no owner for a session** — it stores our own payment
     * state, a provider key and an opaque reference, and nothing about what the payment was for. A
     * narrower "read the ones you started" grant would be a promise the schema cannot keep.
     */
    BILLING_PAYMENT_CHECKOUT = 'billing:payment:checkout',
    /**
     * Operate refunds, recurring authorizations and charges, and merchant credentials.
     *
     * Creating a payment session moved to {@link UserPermission.BILLING_PAYMENT_CHECKOUT}. That was
     * affordable as a move rather than an addition because **nothing in the fleet called that route
     * yet** — the one case where narrowing an existing route costs no backfill. Contrast
     * `commerce:order:*`, which had to be added beside `commerce:catalog:*` rather than moving the
     * merchant's own routes, since `OWNER` is derived from `ALL_USER_PERMISSIONS` at seed time.
     */
    BILLING_PAYMENT_MANAGE = 'billing:payment:manage',

    // ── Invoice ────────────────────────────────────────────────────────────
    /** Read tenant invoices and their immutable line items. */
    BILLING_INVOICE_READ = 'billing:invoice:read',
    /** Create, finalize or void tenant invoices. */
    BILLING_INVOICE_MANAGE = 'billing:invoice:manage',

    // ══ iveri-localization-api ══════════════════════════════════════════════
    //
    // Four permissions for what looks like one job, because translation has four distinct
    // audiences and the whole point of the service is that they are not the same person. An
    // engineer defines keys, a translator writes values, a reviewer decides a language is ready,
    // and a service reads the result. Collapsing them means a contractor hired to translate a
    // panel into Georgian can delete the keys the panel is built from.

    /**
     * Read locales, namespaces, keys, translations and release history — and pull a published
     * bundle, which is how a build gets its strings.
     *
     * One read permission over all of it rather than one per aggregate: none of it is secret. It
     * is text written to be shown to users, and a key list with the values hidden is unusable
     * for the review this permission exists to enable.
     */
    LOCALIZATION_READ = 'localization:read',

    /**
     * Define the structure — locales, namespaces, message keys and their declared variables.
     *
     * The engineer's half, and the sharper one despite sounding like configuration. A message key
     * is compiled into an app (`t('inbox.title')`), so archiving one breaks a screen that already
     * shipped; and editing a message's declared variables invalidates every translation of it in
     * every language at once. A translator must not be able to do either by accident.
     */
    LOCALIZATION_MESSAGE_MANAGE = 'localization:message:manage',

    /**
     * Write translation values.
     *
     * The translator's whole job, and deliberately the *only* thing it grants. This is the
     * permission handed to an outside contractor or an agency, so it must be safe to hand to
     * someone with no stake in the codebase: they can rewrite every string in the product and
     * cannot add a key, remove one, or put a word of it in front of a customer.
     */
    LOCALIZATION_TRANSLATE = 'localization:translate',

    /**
     * Cut a release — the act that actually changes what users read.
     *
     * Separate from `LOCALIZATION_TRANSLATE` for the reason the release aggregate exists at all:
     * editing has to be free so a translator can work in the tool instead of in a spreadsheet,
     * which is only tolerable if editing is not shipping. This is the gate between the two.
     */
    LOCALIZATION_PUBLISH = 'localization:publish',

    /**
     * Resolve and format messages at runtime through `POST /render`.
     *
     * A service permission. `iveri-messaging-api` rendering an OTP body and `iveri-billing-api`
     * rendering an invoice line hold this and nothing else here — they have no reason to read the
     * key catalogue, and separating it keeps a compromised worker from enumerating it.
     */
    LOCALIZATION_RENDER = 'localization:render',

    // ══ iveri-notification-api ══════════════════════════════════════════════

    /**
     * Submit a notification for delivery.
     *
     * **A service permission, and the sharpest one here.** It reaches a real person's mailbox with
     * text the platform composed, and it is not deliberately absent from the seeded `ADMIN` role
     * the way `UNIBOX_REALTIME_PUBLISH` is — an admin has no reason to hold it, because there is
     * nothing for a human to prove by sending a notification to somebody else by hand.
     *
     * Note what it does *not* let a holder do: a submission names a **template key**, never a
     * subject and body. The wording of every notification the platform sends was written by
     * somebody holding {@link UserPermission.NOTIFICATION_TEMPLATE_MANAGE} and translated by
     * somebody holding {@link UserPermission.LOCALIZATION_TRANSLATE}. This is the same shape as
     * `CONDUIT_DISPATCH_SEND` naming an operation rather than a URL, and it is load-bearing for
     * the same reason: without it, a compromised service principal is an authenticated way to
     * send arbitrary text from our own domain to any address it likes.
     */
    NOTIFICATION_SEND = 'notification:send',

    /**
     * Read **your own** in-app inbox, and mark your own rows read.
     *
     * Scoped to the calling principal by the endpoint, not by this permission — there is no
     * variant that reads somebody else's inbox, because a notification is addressed to one person
     * and reading another's is reading their mail. It belongs in every human role, including the
     * narrowest, for the same reason: without it a member cannot see what the product is telling
     * them.
     */
    NOTIFICATION_READ = 'notification:read',

    /** Read the tenant's notification templates and the platform's built-in ones. */
    NOTIFICATION_TEMPLATE_READ = 'notification:template:read',

    /**
     * Override a built-in template, or define a new one — which channels a notification type
     * reaches and which message keys it renders.
     *
     * Configuration that decides what every future notification of a type says, including the
     * password-reset email. Overriding one badly is a way to stop people getting back into their
     * accounts, so it is separated from reading for the same reason `CONDUIT_CONNECTOR_MANAGE` is.
     */
    NOTIFICATION_TEMPLATE_MANAGE = 'notification:template:manage',

    /**
     * Read the delivery log and the dead-letter queue, including each delivery's last error.
     *
     * Grouped with reading rather than with operating the queue, and it is closer to a data-read
     * permission than a config one: the log names who was written to and about what.
     */
    NOTIFICATION_DELIVERY_READ = 'notification:delivery:read',

    /**
     * Redrive a dead-lettered delivery, or cancel one still pending.
     *
     * Separate from reading because it causes a message to be sent to a person rather than
     * returning a row — and because redriving a backlog is a way to mail somebody the same thing
     * fifty times an hour after an outage.
     */
    NOTIFICATION_DELIVERY_OPERATE = 'notification:delivery:operate',

    // ══ iveri-realtime ══════════════════════════════════════════════════════

    /**
     * Ask the shared gateway to issue a short-lived subscription grant after the owning API has
     * authorized a person to read one resource. Service-only: a human may consume a grant but
     * must never mint one.
     */
    REALTIME_SUBSCRIPTION_GRANT_ISSUE = 'realtime:subscription-grant:issue',

    /**
     * Publish an identifier-only resource change. Separate from grant issue because announcing a
     * write and authorizing a read are distinct powers and a service may legitimately need one
     * without the other.
     */
    REALTIME_EVENT_PUBLISH = 'realtime:event:publish',

    // ══ iveri-mobility-api ══════════════════════════════════════════════════

    /** Read worker profiles and operational availability inside the caller's tenant. */
    MOBILITY_WORKER_READ = 'mobility:worker:read',

    /** Enrol workers, amend their capabilities, and suspend or reactivate them. */
    MOBILITY_WORKER_MANAGE = 'mobility:worker:manage',

    /** Go online or offline. Assignment-owned `busy` cannot be requested through this grant. */
    MOBILITY_WORKER_AVAILABILITY_UPDATE = 'mobility:worker:availability:update',

    /**
     * Record one customer's score for one completed assignment.
     *
     * Held by a **product API**, never by a passenger or a sender: only `taxi-api` and
     * `delivery-api` know who was on a given ride or job, and whether it finished. A customer
     * rates through the product, which submits here with its own service credential — the same
     * arrangement as dispatch, and the reason this is not folded into
     * {@link UserPermission.MOBILITY_WORKER_MANAGE}, which is an administrator's grant over
     * somebody's capabilities and employment.
     */
    MOBILITY_WORKER_RATING_SUBMIT = 'mobility:worker:rating:submit',

    /** Read a worker's latest raw coordinate. Separate because location is sensitive operational data. */
    MOBILITY_WORKER_LOCATION_READ = 'mobility:worker:location:read',

    /** Submit the caller's own device heartbeat; a worker may never update somebody else's location. */
    MOBILITY_WORKER_LOCATION_UPDATE = 'mobility:worker:location:update',

    /** Read dispatch aggregate state and its pickup coordinate inside the caller's tenant. */
    MOBILITY_DISPATCH_READ = 'mobility:dispatch:read',

    /** Submit a dispatch request for a vertical-owned ride or delivery job. */
    MOBILITY_DISPATCH_CREATE = 'mobility:dispatch:create',

    /** Cancel, expire, or manually operate a dispatch; intentionally not granted to ordinary submitters. */
    MOBILITY_DISPATCH_OPERATE = 'mobility:dispatch:operate',

    /** Read only the dispatch offers addressed to the caller's own worker profile. */
    MOBILITY_DISPATCH_OFFER_READ = 'mobility:dispatch-offer:read',

    /** Accept or reject only an offer addressed to the caller's own worker profile. */
    MOBILITY_DISPATCH_OFFER_RESPOND = 'mobility:dispatch-offer:respond',

    // ══ taxi-api ════════════════════════════════════════════════════════════

    /** Read ride state, fare quote and trip history inside the caller's tenant. */
    TAXI_RIDE_READ = 'taxi:ride:read',

    /** Request a ride and receive its fare quote. The passenger-facing grant. */
    TAXI_RIDE_CREATE = 'taxi:ride:create',

    /**
     * Confirm, cancel or otherwise advance a ride somebody else requested.
     *
     * Separate from `taxi:ride:create` for the reason Mobility separates `dispatch:operate`
     * from `dispatch:create`: requesting work and overriding it are different powers, and an
     * operator who can cancel any ride in a tenant is not the same principal as a passenger.
     */
    TAXI_RIDE_OPERATE = 'taxi:ride:operate',

    /** Report arrival, trip start and completion for the caller's own assigned worker only. */
    TAXI_RIDE_DRIVE = 'taxi:ride:drive',

    // ══ delivery-api ═══════════════════════════════════════════════════════

    /** Read delivery job and quote data in the caller's tenant; endpoints still check ownership. */
    DELIVERY_JOB_READ = 'delivery:job:read',

    /** Create a delivery job and receive its quote. The sender-facing grant. */
    DELIVERY_JOB_CREATE = 'delivery:job:create',

    /** Confirm or cancel a delivery job; operator actions on another sender's job require this grant. */
    DELIVERY_JOB_OPERATE = 'delivery:job:operate',

    /** Read and advance only jobs assigned to the caller's own courier worker. */
    DELIVERY_JOB_DELIVER = 'delivery:job:deliver',

    // Clinic

    /** Read a clinic's specialties, locations, rooms, devices, treatments and staff. */
    CLINIC_SETUP_READ = 'clinic:setup:read',

    /** Create and change them, including staff working hours. */
    CLINIC_SETUP_MANAGE = 'clinic:setup:manage',

    /** Read the appointment calendar and search for free slots. */
    CLINIC_APPOINTMENT_READ = 'clinic:appointment:read',

    /** Book appointments and move them through their statuses. */
    CLINIC_APPOINTMENT_MANAGE = 'clinic:appointment:manage',

    /** Read a clinic's clients. */
    CLINIC_CLIENT_READ = 'clinic:client:read',

    /** Create and change a clinic's clients. */
    CLINIC_CLIENT_MANAGE = 'clinic:client:manage',

    /** Read callback requests and questions sent from a clinic's website or app. */
    CLINIC_LEAD_READ = 'clinic:lead:read',

    /** Mark those requests as handled. */
    CLINIC_LEAD_MANAGE = 'clinic:lead:manage',

    /** See what a clinic is promoting and publishing. */
    CLINIC_MARKETING_READ = 'clinic:marketing:read',

    /** Change what a clinic is promoting and publishing, including its discounts. */
    CLINIC_MARKETING_MANAGE = 'clinic:marketing:manage',

    /** Read a client's clinical record. Reception runs the calendar without this. */
    CLINIC_RECORD_READ = 'clinic:record:read',

    /** Add to a client's clinical record: screening answers, signed consent and the treatment log. */
    CLINIC_RECORD_MANAGE = 'clinic:record:manage',

    /** See who has read a client's clinical record, which reading the record does not show. */
    CLINIC_RECORD_AUDIT = 'clinic:record:audit',

    /** See what has been paid, each client's balance and the day's takings. */
    CLINIC_PAYMENT_READ = 'clinic:payment:read',

    /** Record money taken at the desk and sell prepaid courses. */
    CLINIC_PAYMENT_RECORD = 'clinic:payment:record',

    /** Give money back. Its own permission, because reception taking money does not imply returning it. */
    CLINIC_PAYMENT_REFUND = 'clinic:payment:refund',

    // Restaurant

    /** Read a restaurant's profile, branches, tables and kitchen stations. */
    RESTAURANT_SETUP_READ = 'restaurant:setup:read',

    /** Change them, including what each branch offers. */
    RESTAURANT_SETUP_MANAGE = 'restaurant:setup:manage',

    /** Read the menu as staff see it, including what is hidden. */
    RESTAURANT_MENU_READ = 'restaurant:menu:read',

    /** Change the menu: dishes, prices, modifiers, photographs. */
    RESTAURANT_MENU_MANAGE = 'restaurant:menu:manage',

    /** Say a dish has run out. A cook can do this without being able to change a price. */
    RESTAURANT_STOCK_MANAGE = 'restaurant:stock:manage',

    /** See orders, bills and the floor. */
    RESTAURANT_ORDER_READ = 'restaurant:order:read',

    /** Take, accept, cancel and hand over orders, and answer a table's requests. */
    RESTAURANT_ORDER_MANAGE = 'restaurant:order:manage',

    /** See the kitchen screen and move plates along it. */
    RESTAURANT_KITCHEN_OPERATE = 'restaurant:kitchen:operate',

    /** See what has been paid and the day's takings. */
    RESTAURANT_PAYMENT_READ = 'restaurant:payment:read',

    /** Record money taken at the table or till. */
    RESTAURANT_PAYMENT_RECORD = 'restaurant:payment:record',

    /** Give money back. Its own permission, because taking money does not imply returning it. */
    RESTAURANT_PAYMENT_REFUND = 'restaurant:payment:refund',

    /** See the booking book. */
    RESTAURANT_RESERVATION_READ = 'restaurant:reservation:read',

    /** Take, seat and cancel bookings. */
    RESTAURANT_RESERVATION_MANAGE = 'restaurant:reservation:manage',

    /** See a restaurant's diners. */
    RESTAURANT_CUSTOMER_READ = 'restaurant:customer:read',

    /** Change what is held about them. */
    RESTAURANT_CUSTOMER_MANAGE = 'restaurant:customer:manage',

    /** See promotions and reviews. */
    RESTAURANT_MARKETING_READ = 'restaurant:marketing:read',

    /** Change promotions and moderate reviews. */
    RESTAURANT_MARKETING_MANAGE = 'restaurant:marketing:manage',

    /** See sales reports. */
    RESTAURANT_REPORT_READ = 'restaurant:report:read',

    /** See Ezo's moderation queue, what was reported and the appeals against decisions. */
    SOCIAL_MODERATION_READ = 'social:moderation:read',

    /** Decide a case: dismiss it, remove the content, warn, suspend or ban. */
    SOCIAL_MODERATION_DECIDE = 'social:moderation:decide',

    /** Answer an appeal. Never against your own decision, which the service refuses. */
    SOCIAL_APPEAL_DECIDE = 'social:appeal:decide',

    /** Look up members and their records. */
    SOCIAL_MEMBER_READ = 'social:member:read',

    /** Suspend, ban or reinstate a member without a report behind it. */
    SOCIAL_MEMBER_SANCTION = 'social:member:sanction',

    /** Read the record of what staff looked at and did. */
    SOCIAL_AUDIT_READ = 'social:audit:read',
    // HR

    /** Read a company's HR settings, locations, departments and job titles. */
    HR_ORG_READ = 'hr:org:read',

    /** Change them. */
    HR_ORG_MANAGE = 'hr:org:manage',

    /** Read employee records, without pay or identity numbers. */
    HR_EMPLOYEE_READ = 'hr:employee:read',

    /** Add and change employee records, record a job change, and end somebody's employment. */
    HR_EMPLOYEE_MANAGE = 'hr:employee:manage',

    /** Read pay, identity numbers and bank details. Its own permission, because keeping a directory right does not need them. */
    HR_COMPENSATION_READ = 'hr:compensation:read',

    /** Change them. */
    HR_COMPENSATION_MANAGE = 'hr:compensation:manage',

    /** See who read or changed pay and identity numbers, which reading them does not show. */
    HR_AUDIT_READ = 'hr:audit:read',

    /** See everybody's time off, balances and the holiday calendar. A manager sees their own reports without this. */
    HR_TIME_OFF_READ = 'hr:time-off:read',

    /** Decide anybody's time off, adjust balances, and change leave types and holidays. */
    HR_TIME_OFF_MANAGE = 'hr:time-off:manage',

    /** See everybody's attendance and timesheets. */
    HR_ATTENDANCE_READ = 'hr:attendance:read',

    /** Change attendance and decide corrections. */
    HR_ATTENDANCE_MANAGE = 'hr:attendance:manage',

    /** Read employee documents and company policies. */
    HR_DOCUMENT_READ = 'hr:document:read',

    /** Upload, change and remove them. */
    HR_DOCUMENT_MANAGE = 'hr:document:manage',

    /** See onboarding and offboarding checklists. */
    HR_ONBOARDING_READ = 'hr:onboarding:read',

    /** Change the templates and start a checklist for somebody. */
    HR_ONBOARDING_MANAGE = 'hr:onboarding:manage',

    /** Post and withdraw company announcements. */
    HR_ANNOUNCEMENT_MANAGE = 'hr:announcement:manage',

    /** See payroll runs and payslips. */
    HR_PAYROLL_READ = 'hr:payroll:read',

    /** Prepare a payroll run. */
    HR_PAYROLL_MANAGE = 'hr:payroll:manage',

    /** Approve a payroll run, which freezes every payslip in it. Its own permission, so one person cannot both prepare and sign off. */
    HR_PAYROLL_APPROVE = 'hr:payroll:approve',

    /** See job openings and applicants. */
    HR_HIRING_READ = 'hr:hiring:read',

    /** Change job openings and move applicants through the pipeline. */
    HR_HIRING_MANAGE = 'hr:hiring:manage',

    /** See goals and reviews across the company. A manager sees their own reports without this. */
    HR_PERFORMANCE_READ = 'hr:performance:read',

    /** Run review cycles. */
    HR_PERFORMANCE_MANAGE = 'hr:performance:manage',

    /** See how a gym is set up: its profile, branches, rooms, classes, staff and plans. */
    GYM_SETUP_READ = 'gym:setup:read',

    /** Change how a gym is set up, including its prices and booking rules. */
    GYM_SETUP_MANAGE = 'gym:setup:manage',

    /** See members, their memberships and their waivers. */
    GYM_MEMBER_READ = 'gym:member:read',

    /** Add and change members, and sell, freeze and cancel memberships. */
    GYM_MEMBER_MANAGE = 'gym:member:manage',

    /** See who has come through the door. */
    GYM_DOOR_READ = 'gym:door:read',

    /** Scan people in. */
    GYM_DOOR_OPERATE = 'gym:door:operate',

    /** Let somebody in whom the rules refused. Its own permission, and recorded with a reason. */
    GYM_DOOR_OVERRIDE = 'gym:door:override',

    /** See the timetable and who is booked. */
    GYM_SCHEDULE_READ = 'gym:schedule:read',

    /** Change the timetable: patterns, dates, trainers and cancellations. */
    GYM_SCHEDULE_MANAGE = 'gym:schedule:manage',

    /** Book people into classes and mark who came. */
    GYM_BOOKING_MANAGE = 'gym:booking:manage',

    /** See what has been paid, what is owing and the day's takings. */
    GYM_PAYMENT_READ = 'gym:payment:read',

    /** Record money taken at the desk. */
    GYM_PAYMENT_RECORD = 'gym:payment:record',

    /** Give money back. Its own permission, because taking money does not imply returning it. */
    GYM_PAYMENT_REFUND = 'gym:payment:refund',

    /** Read a member's workouts and measurements. The front desk runs without this. */
    GYM_TRAINING_READ = 'gym:training:read',

    /** Write routines, assign them and record measurements, and keep the exercise library. */
    GYM_TRAINING_MANAGE = 'gym:training:manage',

    /** Read trial requests and questions sent from a gym's website or app. */
    GYM_LEAD_READ = 'gym:lead:read',

    /** Work through them. */
    GYM_LEAD_MANAGE = 'gym:lead:manage',

    /** See promo codes and the gallery. */
    GYM_MARKETING_READ = 'gym:marketing:read',

    /** Change promo codes and the gallery. */
    GYM_MARKETING_MANAGE = 'gym:marketing:manage',

    /** See the owner's reports. */
    GYM_REPORT_READ = 'gym:report:read',

    // Chat

    /** Open, reconcile and close conversations about something in a product. Held by that product's service key. */
    CHAT_EMBED_MANAGE = 'chat:embed:manage',

    /** See the moderation queue and what a report copied. Every read of a conversation is logged. */
    CHAT_MODERATION_READ = 'chat:moderation:read',

    /** Decide a case: dismiss it, remove the message, warn, suspend or ban. */
    CHAT_MODERATION_DECIDE = 'chat:moderation:decide',

    /** Look people up, with their record. Never their conversations. */
    CHAT_PERSON_READ = 'chat:person:read',

    /** Suspend, ban or reinstate somebody without a report behind it. */
    CHAT_PERSON_SANCTION = 'chat:person:sanction',

    /** Read the record of what staff looked at and did. */
    CHAT_AUDIT_READ = 'chat:audit:read',

    /**
     * Run Baasi inside another company's product: create its apps, issue and revoke their secrets, change who may
     * start conversations, and refuse tokens signed before a moment. Held by that company's own staff.
     */
    CHAT_APP_MANAGE = 'chat:app:manage',

    // ── Iveri's own operators ───────────────────────────────────────────────
    // Held only in Iveri's operator workspace, never by a company: see `PLATFORM_PERMISSIONS`.

    /** List every company on Iveri and read one: its status, its people count and its owner. */
    PLATFORM_TENANT_READ = 'platform:tenant:read',

    /** Add a company with its owner's invitation, and suspend or reactivate one. */
    PLATFORM_TENANT_MANAGE = 'platform:tenant:manage',

    /** Read every company's product licences. */
    PLATFORM_LICENCE_READ = 'platform:licence:read',

    /** Give a company a licence for a product, change its seats or dates, and cancel it. */
    PLATFORM_LICENCE_MANAGE = 'platform:licence:manage',

    /**
     * Ask whether a company's licence for one product is live. Held by the products' own service credentials, so a
     * product can refuse a company whose licence has ended without reading anything else about it.
     */
    PLATFORM_LICENCE_CHECK = 'platform:licence:check',
}

/**
 * The permissions that act across companies. They are granted only inside Iveri's own operator workspace, which each
 * service knows as `PLATFORM_TENANT_ID`, and a service honours one only from that workspace: identity refuses them on
 * any other workspace's role or key, and a route that uses one also checks where the token came from.
 */
export const PLATFORM_PERMISSIONS: readonly UserPermission[] = Object.freeze([
    UserPermission.PLATFORM_TENANT_READ,
    UserPermission.PLATFORM_TENANT_MANAGE,
    UserPermission.PLATFORM_LICENCE_READ,
    UserPermission.PLATFORM_LICENCE_MANAGE,
    UserPermission.PLATFORM_LICENCE_CHECK,
]);

/** Whether a permission acts across companies, and so may only be held in Iveri's operator workspace. */
export function isPlatformPermission(permission: string): boolean {
    return (PLATFORM_PERMISSIONS as readonly string[]).includes(permission);
}

/**
 * Every permission a company can hold, for seeding the owner role and validating custom-role input.
 *
 * It leaves out `PLATFORM_PERMISSIONS`. `OWNER` is derived from this list, so a cross-company permission in it would be
 * handed to the owner of every company that signs up.
 *
 * Frozen because it is shared mutable state in a browser bundle otherwise: one caller sorting
 * it in place reorders it for everyone.
 */
export const ALL_USER_PERMISSIONS: readonly UserPermission[] = Object.freeze(
    Object.values(UserPermission).filter((permission) => !isPlatformPermission(permission)),
);
