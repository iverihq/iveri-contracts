# Changelog

Breaking changes and how to move across them. Additions are described in the README.

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
