# @iveri/contracts

The wire contract every Iveri service and frontend compiles against: shared types and plain
enums, and nothing else.

```bash
pnpm add @iveri/contracts
```

```ts
// Cross-service primitives.
import { CursorPage, ErrorCode, Maybe, Paginated, UUID, UserPermission } from '@iveri/contracts';

// One service's wire surface.
import type { CaptureSummary, Endpoint } from '@iveri/contracts/conduit';
import type { AuthSession, Principal } from '@iveri/contracts/identity';
import type { Conversation, Message } from '@iveri/contracts/unibox';
```

Five entry points, and no others — never `@iveri/contracts/dist/...`.

The per-service surfaces are **not** re-exported from the root, deliberately. Conduit owns a
`Provider`, a `Connection` and an `Endpoint`; Unibox owns a `Channel` and a `Contact` and would
have wanted two of those names for entirely different things. Keeping each service behind its own
entry point means that collision never has to be resolved by renaming a type in a shipped API —
and it stopped being hypothetical the moment `unibox` was added.

## Zero runtime dependencies — the rule that defines this package

This package ends up inside browser bundles, so it declares **no** `dependencies`,
`peerDependencies` or `optionalDependencies`, and its compiled output imports nothing outside
itself. Nothing from `@nestjs/*`, `typeorm`, `class-validator`, or `node:*` may ever appear
here — not even as a type-only import.

That is why it is a separate package from `@iveri/nest-sdk` rather than a folder inside it.
It is enforced by `scripts/verify-zero-runtime-deps.mjs`, which runs as part of `build`: CI
fails on the PR that adds a dependency, not on a frontend build weeks later.

Anything needing a dependency belongs in `@iveri/nest-sdk` (backend) or `@iveri/react-kit`
(frontend).

## What is here

### `type/`

| Type                               | Use                                                                                           |
| ---------------------------------- | --------------------------------------------------------------------------------------------- |
| `Nil`, `Maybe<T>`, `Nullable<T>`   | absent values. `Nullable` for anything crossing the wire — `JSON.stringify` drops `undefined` |
| `UUID`                             | template-literal shape hint; validation stays at the edge with `@IsUUID()`                    |
| `Paginated<T>`                     | offset paging, where the client needs a total or arbitrary page jumps                         |
| `CursorPage<T>`                    | cursor paging — the default for lists that grow while being read                              |
| `IsoDateTime`                      | a timestamp as it appears on the wire. JSON has no date type — this is a `string`             |
| `ApiErrorResponse`, `ApiErrorBody` | the error envelope. **Only errors are enveloped**; a success is the bare payload              |

### `enum/`

`ErrorCode` — the stable, machine-readable error classification carried in every error
response. Clients branch on `code`; `message` is for humans and may change at any time.

`UserPermission` + `ALL_USER_PERMISSIONS` — **one catalogue of permissions for the whole
platform**, not one per service. `iveri-identity-api` stores members on role rows, resolves
them into access tokens and validates custom-role input against `ALL_USER_PERMISSIONS`; every
other service reads them back out of the token to authorize a request; the frontend's
`<RequirePermission>` branches on the same values. A service defining its own enum locally
would find its permissions unassignable, because identity would reject them as unknown.

Values are `<resource>:<action>`, or `<service>:<resource>:<action>` where a resource name
would otherwise collide — identity's members are unprefixed because they predate the shared
catalogue and are already embedded in issued tokens and stored role rows.

### `api/identity/` → `@iveri/contracts/identity`

`iveri-identity-api`'s authentication surface: `SignupBody`, `LoginBody`, `RefreshTokenBody`,
`AcceptInvitationBody`, `AuthTokens`, `ServiceToken`, `Principal`, `AuthSession`, plus
`TenantStatus`, `MembershipStatus` and `PrincipalType`.

It also holds **`AccessTokenPayload`** — the claims inside the JWT itself, rather than a request
or response body. It belongs here for a stronger reason than the rest: identity is the only
service that _issues_ a token and every other service _verifies_ one, so both sides must agree
claim for claim. `conduit-api` kept a hand-copied duplicate until the `pt` claim had to be added
to both at once — the drift a copy invites, arriving exactly when it is most expensive.

Auth only. Identity also exposes tenant, user, membership, role and API-key routes; those have
one consumer each and stay in the service until a second one appears.

### `api/conduit/` → `@iveri/contracts/conduit`

`conduit-api`'s full admin surface.

Inspect mode: `Endpoint`, `CaptureSummary`/`CaptureDetail`, `Provider` with its
`SignatureManifest`/`HandshakeManifest`, `Replay`, `SignatureDiagnostic`.

Gateway mode: `Destination`, `Route` with its `HeaderMatcher`/`BodyMatcher`, `Delivery` and
`DeliveryAttempt`.

Plus the request bodies for each, and the seven enums they are built from — `SignatureVerdict`,
`SignatureAlgorithm`, `SignatureEncoding`, `SignatureHeaderScheme`, `HandshakeKind`,
`MatchOperator`, `DeliveryStatus`.

### `api/unibox/` → `@iveri/contracts/unibox`

`unibox-api`'s surface: `Channel` and its `ChannelIngestSecretResponse`, `Contact` with its
`ContactIdentity`, `Conversation`/`ConversationWithMessages`, `Message` with `MessageAttachment`,
`Team`, `CannedReply`, plus the request bodies and six enums — `ChannelPlatform`,
`ConversationStatus`, `MessageDirection`, `MessageAuthorType`, `MessageStatus`,
`MessageContentType`.

### `api/unibox-ai/` → `@iveri/contracts/unibox-ai`

The authenticated agent-runtime boundary: bounded conversation context, the handoff-aware agent
run request, its acceptance statuses and response, and safe tenant MCP server metadata and
registration request bodies. Credential values are request-only and never appear in responses.

Two of those enums carry members nothing writes yet, and both are deliberate rather than
speculative. `MessageAuthorType.AI` exists before `unibox-ai` does, because it is what an agent
taking over reads to know what the customer was already told — adding it later would leave every
message written before then indistinguishable from a human's, retroactively. `ChannelPlatform.ECHO`
is a first-class member for the same reason Conduit's `local-echo` connector is: the whole pipeline
is provable without a Meta app, and a test double would put a branch in the normalizer registry
that only exists under Jest.

### Why the wire shapes moved here

`conduit-admin-web` hand-transcribed all of it, carefully and with comments. It still drifted:
`TenantStatus` was written `'active' | 'suspended' | 'cancelled'` where identity sends
`'ACTIVE' | 'SUSPENDED' | 'PENDING_DELETION'` — wrong casing, and a member that has never
existed — and `bodySha256` was missing from two shapes. Nothing caught any of it, because a
hand-written mirror is checked by nobody.

Both sides now compile against these types: each service's response DTO `implements` the
interface it fulfils, so a field renamed in `conduit-api` fails `tsc` in `conduit-api` rather
than surfacing as `undefined` in a panel weeks later.

## What is deliberately **not** here yet

`event/` — the domain event envelope and topic map. No service publishes one yet; it lands with
Conduit's outbox.

## Adding to the contract

- A new `ErrorCode` or `UserPermission` member is a **minor** version. Changing what an
  existing member means, or removing one, is **major** — clients branch on these, and a
  removed permission silently downgrades every live session whose token still carries it.
- Version `0.9.0` adds the first Commerce permissions: `commerce:catalog:read` and
  `commerce:catalog:manage`.
- Version `0.10.0` adds the Unibox AI agent-run entry point and `unibox:ai:run` permission.
- Version `0.11.0` adds safe MCP server metadata, registration request bodies, and the
  `unibox:mcp:read` / `unibox:mcp:manage` permissions.
- Version `0.12.0` adds the billing plan, subscription, usage and payment permissions.
- Version `0.13.0` adds the billing invoice read and manage permissions.
- Version `0.14.0` adds messaging message, OTP and credit permissions.
- Version `0.15.0` adds optional per-key FIFO ordering to outbound dispatches.
- Widening a type is minor; narrowing it is major.
- Under `api/`, the contract follows the service: add the field to the service's DTO and to the
  interface in the same release, and let `implements` prove they agree.
- Breaking changes get a migration note in `CHANGELOG.md`. Services upgrade deliberately.

## Build output

Dual ESM + CJS (`dist/esm`, `dist/cjs`) behind an `exports` map, so NestJS `require`s it and
Vite tree-shakes it. `sideEffects: false`.

The subpath entry points also need a `typesVersions` block, because **TypeScript only reads
`exports` under `moduleResolution` `node16`/`nodenext`/`bundler`** and every Nest service in the
fleet compiles with `"node"`. Without it `@iveri/contracts/conduit` resolves at runtime and is
untyped at compile time — in one repo but not another, which is a confusing thing to debug.
`scripts/verify-entry-points.mjs` runs in `build` and fails if either half is missing.
