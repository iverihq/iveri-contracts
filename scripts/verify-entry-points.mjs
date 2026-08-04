/**
 * Every declared entry point must resolve, as JavaScript *and* as types, in both module
 * systems.
 *
 * The subpaths (`@iveri/contracts/conduit`, `@iveri/contracts/identity`) are more fragile than
 * the root: an `exports` map is honoured by Node and by bundlers, but **TypeScript only reads
 * it under `moduleResolution` `node16`/`nodenext`/`bundler`**. Every Nest service in the fleet
 * compiles with `moduleResolution: "node"`, which ignores `exports` entirely and resolves a
 * subpath by looking for a matching path on disk. So the services need `typesVersions`, the
 * frontends and Node itself need `exports`, and dropping either one produces a failure that
 * looks nothing like its cause — `conduit-api` reporting "Cannot find module
 * '@iveri/contracts/conduit'" while the identical import compiles in `conduit-admin-web`.
 *
 * Runs in `build`, after the emit, so the package cannot be published half-wired.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(resolve(PACKAGE_ROOT, 'package.json'), 'utf8'));
const require = createRequire(import.meta.url);

/** One representative runtime export per entry point — an enum, so it survives to JavaScript. */
const ENTRY_POINTS = [
    ['.', 'UserPermission'],
    ['./conduit', 'SignatureVerdict'],
    ['./identity', 'TenantStatus'],
    ['./unibox', 'ChannelPlatform'],
];

for (const [subpath, member] of ENTRY_POINTS) {
    const specifier = subpath === '.' ? manifest.name : `${manifest.name}/${subpath.slice(2)}`;
    const conditions = manifest.exports[subpath];

    assert.ok(conditions, `${subpath} is missing from the exports map.`);

    for (const condition of ['types', 'import', 'require']) {
        const target = resolve(PACKAGE_ROOT, conditions[condition]);
        assert.ok(
            existsSync(target),
            `${specifier} declares a ${condition} of ${conditions[condition]}, which was not emitted.`,
        );
    }

    // Resolves through the exports map exactly as a consumer's `require` would.
    const loaded = require(specifier);
    assert.ok(member in loaded, `${specifier} resolved but does not export ${member}.`);

    // The node10 resolver ignores `exports`; subpaths need a typesVersions entry to be typed.
    if (subpath !== '.') {
        const key = subpath.slice(2);
        const mapped = manifest.typesVersions?.['*']?.[key];
        assert.ok(mapped, `${specifier} has no typesVersions entry; every Nest service resolves it as untyped.`);
        assert.ok(
            existsSync(resolve(PACKAGE_ROOT, mapped[0])),
            `${specifier} maps types to ${mapped[0]}, which was not emitted.`,
        );
    }
}

console.log(`@iveri/contracts: ${ENTRY_POINTS.length} entry points resolve`);
