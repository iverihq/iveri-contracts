# Changelog

Breaking changes and how to move across them. Additions are described in the README.

## 0.83.0 — Conduit connects to Google and Slack

**What changed.** `ConnectorAuthType` gains `oauth2-authorization-code` (a consent flow with PKCE) and
`oauth2-jwt-bearer` (a service account acting as a named user). `ConnectorAuthManifest` gains
`authorizationUrl`, `authorizationParams`, `personAuthorizationParams`, `tokenObjectPaths` and
`subjectVariable`; `ConnectorOperation` gains `alreadyAppliedStatuses`; `ConnectorRetryPolicy` gains
`successBodyField`. `Connection` gains `ownerUserId` and `connectedAt`, `Dispatch` gains `ownerUserId`
and `authSubject`, and `SubmitDispatchBody` takes `onBehalfOfUserId`. `StartConnectBody`,
`ConnectStart`, `ConnectAttempt`, `ConnectAttemptStatus` and `GetConnectionsQuery` are new.

**Who is affected.** Whatever builds a `ConnectorOperation`, a `ConnectorRetryPolicy`, a `Connection` or
a `Dispatch` — `conduit-api` and `conduit-admin-web`'s connector form and fixtures — and every
exhaustive map over `ConnectorAuthType`.

**Moving across.** Set `alreadyAppliedStatuses: []` on an operation and `successBodyField: null` on a
retry policy unless the provider needs them; set `ownerUserId: null` and `connectedAt: null` on a
connection and `ownerUserId: null`, `authSubject: null` on a dispatch. Give the two new auth types an
entry wherever a `Record<ConnectorAuthType, …>` is kept.

## 0.82.1 — a server names a participant by the app's own id

**What changed.** `OpenServerChatRequest` takes `ServerChatParticipant`s, whose `userId` is any string of the app's,
where 0.82.0 had reused the embed participant and typed it as a Baasi uuid. Nothing else moved.

## 0.82.0 — Baasi inside other companies' apps

**What changed.** `chat:app:manage` lets a company's staff run Baasi apps; `ChatApp`, its secrets, the server API's
users, tokens and export, and `ChatSocketTicket` describe them. `ChatPersonCard`, `ChatProfile` and `ChatStaffPerson`
carry `externalId`, the app's own id for a person, null for everybody signed in through Iveri. `StartDirectChatRequest`,
`CreateGroupChatRequest` and `AddChatMembersRequest` take either Baasi ids or an app's own ids, so their id fields are
now optional.

**Who is affected.** Whatever builds a person card, a profile or a staff person (`chat-api`, the fixtures in
`@iveri/chat-kit`), and whatever reads `userId`, `memberUserIds` or `userIds` off those requests.

**Moving across.** Set `externalId: null` where a card, a profile or a staff person is built for an Iveri user. Send
the requests as before.

## 0.81.0 — a product can open a group

**What changed.** `OpenEmbeddedChatRequest.isGroup` lets a product say a conversation is a group, such as an
HR team, and `ChatConversationSummary.isGroup` reports it, true as well for every Baasi group. A product's
conversation that held exactly two people used to be drawn as one person talking to the other.

**Who is affected.** Whatever builds a `ChatConversationSummary` or a `ChatConversation`, where `isGroup` is now
required: `chat-api` and the fixtures in `@iveri/chat-kit`.

**Moving across.** Set `isGroup` where the summary is built. A product sends it only for a conversation of many.

## 0.80.0 — Ezo's inbox event goes

**What changed.** `RealtimeEventType.SOCIAL_INBOX_UPDATED` is removed. It announced a change to Ezo's own
inbox, which has not existed since 0.75.0: Baasi holds Ezo's conversations and its own realtime service
tells a member about them. Nothing published or subscribed to the event.

**Who is affected.** `iveri-realtime`, whose exhaustive event-to-resource table names it.

**Moving across.** Delete the entry. `SOCIAL_ACTIVITY_UPDATED` is unchanged.

## 0.75.0 — Ezo's messages move to Baasi

**What changed.** Ezo keeps every rule about who may message whom, and Baasi, Iveri's messenger, holds
the conversations. So `@iveri/contracts/social` no longer describes a conversation or a message:

- `SocialConversation`, `SocialMessage`, `SocialMessagePreview` and `SendSocialMessageRequest` are
  removed. `POST /conversations` answers `SocialConversationHandle`, the Baasi conversation id, and the
  thread is read and written through `@iveri/chat-kit` and the `chat` entry point.
- `SocialReportTarget.MESSAGE` is removed. A message is reported to Baasi and worked in Baasi's queue.
- `SocialRefusal.MESSAGE_EMPTY` is removed and `SocialRefusal.MESSAGING_UNAVAILABLE` added, for a
  deployment that cannot reach Baasi.
- `SocialMe.unreadMessageCount`, `SocialUnreadCounts.messages` and `SocialPreferences.emailOnMessage`
  are removed. Ezo no longer sees a message arrive, so it can neither count one nor email about one; the
  kit's inbox carries the unread count.
- `SocialCaseEvidence.context`, `SocialCaseMessageContext` and `SOCIAL_LIMITS.MESSAGE_MAX` are removed with
  the message report.

**Who is affected.** `social-api`, `social-web`, `social-app` and `social-admin-web`.

**Moving across.** Open a conversation through `social-api` and hand the id to the kit. A moderation
screen drops its `message` row; a case of that kind cannot be created any more.

## 0.39.0 — ESM-only

**What changed.** The package is published as native ES modules only: `"type": "module"`, one
build in `dist/`, and an `exports` map whose every entry offers `types` and `default`. The
CommonJS build (`dist/cjs`), the `import`/`require` condition pair and the `typesVersions` block
are removed. No type or enum changed.

**Who is affected.** A consumer compiling with `moduleResolution: node` (`node10`) no longer sees
the subpath types (`@iveri/contracts/conduit` and the rest) — TypeScript 6 refuses that setting
anyway. Nothing else should notice.

**Moving across.**

- A NestJS service or other Node code: compile with `module`/`moduleResolution: nodenext` — the
  `@iveri/tsconfig/node.json` and `nest.json` presets from 0.2.0 set both.
- A Vite or Expo app: `moduleResolution: bundler`, which they already use.
- Under `verbatimModuleSyntax` an interface or type alias must be imported with `import type`;
  the enums (`UserPermission`, `ErrorCode`, every `…Status`) are values and are imported normally.
