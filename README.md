# @iveri/contracts

The wire contract every Iveri service and frontend compiles against: shared types and plain
enums, and nothing else.

```bash
pnpm add @iveri/contracts
```

```ts
import { ApiResponse, CursorPage, ErrorCode, Maybe, Paginated, UUID } from '@iveri/contracts';
```

Import from the root barrel only — never `@iveri/contracts/dist/...`.

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

| Type                                                                          | Use                                                                                           |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `Nil`, `Maybe<T>`, `Nullable<T>`                                              | absent values. `Nullable` for anything crossing the wire — `JSON.stringify` drops `undefined` |
| `UUID`                                                                        | template-literal shape hint; validation stays at the edge with `@IsUUID()`                    |
| `Paginated<T>`                                                                | offset paging, where the client needs a total or arbitrary page jumps                         |
| `CursorPage<T>`                                                               | cursor paging — the default for lists that grow while being read                              |
| `ApiSuccessResponse<T>`, `ApiErrorResponse`, `ApiErrorBody`, `ApiResponse<T>` | the response envelope                                                                         |

### `enum/`

`ErrorCode` — the stable, machine-readable error classification carried in every error
response. Clients branch on `code`; `message` is for humans and may change at any time.

## What is deliberately **not** here yet

`event/` (domain event envelope, topics) and `api/` (per-service request/response shapes) are
in the plan but unwritten: no service defines them yet. They get added when a real consumer
needs them, per the second-consumer rule — not in anticipation.

## Adding to the contract

- A new `ErrorCode` member is a **minor** version. Changing what an existing member means, or
  removing one, is **major** — clients branch on these.
- Widening a type is minor; narrowing it is major.
- Breaking changes get a migration note in `CHANGELOG.md`. Services upgrade deliberately.

## Build output

Dual ESM + CJS (`dist/esm`, `dist/cjs`) behind an `exports` map, so NestJS `require`s it and
Vite tree-shakes it. `sideEffects: false`.
