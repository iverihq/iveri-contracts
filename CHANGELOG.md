# Changelog

Breaking changes and how to move across them. Additions are described in the README.

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
