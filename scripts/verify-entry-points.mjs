/**
 * Every declared entry point must be emitted and must load in Node, both imported and required.
 *
 * The package is ESM-only and each entry point offers exactly two conditions: `types` for
 * TypeScript and `default` for everything else. `default` rather than `import` is load-bearing:
 * Metro resolves a React Native bundle with the `require` and `default` conditions, so an
 * `import`-only map builds every web app and service and breaks both Expo apps. Requiring each
 * entry point below is the same question Metro asks.
 *
 * Runs in `build`, after the emit, so the package cannot be published half-wired.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const PACKAGE_ROOT = resolve(import.meta.dirname, '..');
const manifest = JSON.parse(readFileSync(resolve(PACKAGE_ROOT, 'package.json'), 'utf8'));
const require = createRequire(import.meta.url);

/** One representative runtime export per entry point — an enum, so it survives to JavaScript. */
const ENTRY_POINTS = new Map([
    ['.', 'UserPermission'],
    ['./conduit', 'SignatureVerdict'],
    ['./identity', 'TenantStatus'],
    ['./unibox', 'ChannelPlatform'],
    ['./unibox-ai', 'AgentRunStatus'],
    ['./localization', 'TranslationStatus'],
    ['./notification', 'NotificationChannel'],
    ['./realtime', 'RealtimeResourceType'],
    ['./clinic', 'ClinicResourceStatus'],
    ['./restaurant', 'RestaurantOrderStatus'],
    ['./social', 'SocialMemberStatus'],
    ['./gym', 'GymMembershipStatus'],
    ['./hr', 'HrEmploymentStatus'],
    ['./mobility', 'MobilityServiceType'],
]);

// Left behind by a dual build, each of these points at a file that no longer exists.
for (const field of ['main', 'module', 'types', 'typesVersions']) {
    assert.ok(!(field in manifest), `package.json still declares "${field}"; the exports map is the only entry.`);
}

const declared = Object.keys(manifest.exports).filter((subpath) => subpath !== './package.json');
assert.deepEqual(
    declared.toSorted(),
    [...ENTRY_POINTS.keys()].toSorted(),
    'The exports map and the entry points this script checks have drifted apart.',
);

for (const [subpath, member] of ENTRY_POINTS) {
    const specifier = subpath === '.' ? manifest.name : `${manifest.name}/${subpath.slice(2)}`;
    const conditions = manifest.exports[subpath];

    // `types` first: resolvers take the first condition that matches, and TypeScript reads only
    // `types`, so behind `default` it would land on JavaScript and find no declarations.
    assert.deepEqual(
        Object.keys(conditions),
        ['types', 'default'],
        `${specifier} must offer exactly { types, default }, types first.`,
    );
    for (const target of Object.values(conditions)) {
        assert.ok(
            typeof target === 'string' && target.startsWith('./dist/'),
            `${specifier} maps to ${JSON.stringify(target)}; every target is a path into ./dist.`,
        );
        assert.ok(
            existsSync(resolve(PACKAGE_ROOT, target)),
            `${specifier} points at ${target}, which was not emitted.`,
        );
    }

    // Both resolve through the exports map by self-reference, as they would from node_modules.
    const imported = await import(specifier);
    assert.ok(member in imported, `${specifier} imported but does not export ${member}.`);

    const required = require(specifier);
    assert.ok(member in required, `${specifier} required but does not export ${member}.`);
}

console.log(`@iveri/contracts: ${ENTRY_POINTS.size} entry points are emitted, import and require`);
