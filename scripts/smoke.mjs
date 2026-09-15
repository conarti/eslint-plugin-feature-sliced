import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

/**
 * @description
 * Smoke test for the built package in dist.
 * Checks that the CJS entry stays callable (`require(pkg)` must be the factory
 * itself, not a module namespace) and that the ESM entry keeps both the default
 * and the named exports. Run it after every build.
 */

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

const EXPECTED_RULE_NAMES = [
  '@conarti/feature-sliced/layers-slices',
  '@conarti/feature-sliced/absolute-relative',
  '@conarti/feature-sliced/public-api',
  '@conarti/feature-sliced/no-cross-segment-reexport',
  '@conarti/feature-sliced/import-order',
];

const failures = [];

function check(message, condition) {
  if (!condition) {
    failures.push(message);
  }
}

const packageJson = require(path.join(rootDir, 'package.json'));
const cjs = require(path.join(rootDir, 'dist/index.cjs'));

check(
  `dist/index.cjs must export the createPlugin function itself, got '${typeof cjs}'`,
  typeof cjs === 'function',
);
check(
  `dist/index.cjs must expose the 'createPlugin' named export, got '${typeof cjs.createPlugin}'`,
  typeof cjs.createPlugin === 'function',
);
check(
  `dist/index.cjs must expose the 'default' export, got '${typeof cjs.default}'`,
  typeof cjs.default === 'function',
);
check(
  `dist/index.cjs must expose the 'plugin' named export, got '${typeof cjs.plugin}'`,
  typeof cjs.plugin === 'object' && cjs.plugin !== null,
);
check(
  `dist/index.cjs must expose the 'layers' named export as an array`,
  Array.isArray(cjs.layers),
);
check(
  `dist/index.cjs must expose the 'segments' named export as an array`,
  Array.isArray(cjs.segments),
);
check(
  `dist/index.cjs must expose the 'PLUGIN_NAME' named export, got '${typeof cjs.PLUGIN_NAME}'`,
  typeof cjs.PLUGIN_NAME === 'string',
);
check(
  `dist/index.cjs must expose the 'RULE_NAMES' named export, got '${typeof cjs.RULE_NAMES}'`,
  typeof cjs.RULE_NAMES === 'object' && cjs.RULE_NAMES !== null,
);

if (typeof cjs === 'function') {
  const cjsConfig = cjs();
  const cjsRuleNames = Object.keys(cjsConfig.rules ?? {});

  check(
    `createPlugin() from dist/index.cjs must enable ${EXPECTED_RULE_NAMES.length} rules, got ${cjsRuleNames.length}: ${cjsRuleNames.join(', ')}`,
    cjsRuleNames.length === EXPECTED_RULE_NAMES.length,
  );

  for (const ruleName of EXPECTED_RULE_NAMES) {
    check(
      `createPlugin() from dist/index.cjs must enable the '${ruleName}' rule`,
      cjsRuleNames.includes(ruleName),
    );
  }
}

check(
  `plugin.meta.version in dist/index.cjs must be '${packageJson.version}', got '${cjs.plugin?.meta?.version}'`,
  cjs.plugin?.meta?.version === packageJson.version,
);

const esm = await import(pathToFileURL(path.join(rootDir, 'dist/index.js')).href);

check(
  `dist/index.js must have the createPlugin function as its default export, got '${typeof esm.default}'`,
  typeof esm.default === 'function',
);
check(
  `dist/index.js must expose the 'createPlugin' named export, got '${typeof esm.createPlugin}'`,
  typeof esm.createPlugin === 'function',
);
check(
  `dist/index.js must expose the 'layers' named export as an array`,
  Array.isArray(esm.layers),
);
check(
  `dist/index.js must expose the 'segments' named export as an array`,
  Array.isArray(esm.segments),
);
check(
  `dist/index.js must expose the 'plugin' named export, got '${typeof esm.plugin}'`,
  typeof esm.plugin === 'object' && esm.plugin !== null,
);

if (typeof esm.default === 'function') {
  const esmRuleNames = Object.keys(esm.default().rules ?? {});

  check(
    `createPlugin() from dist/index.js must enable ${EXPECTED_RULE_NAMES.length} rules, got ${esmRuleNames.length}: ${esmRuleNames.join(', ')}`,
    esmRuleNames.length === EXPECTED_RULE_NAMES.length,
  );

  for (const ruleName of EXPECTED_RULE_NAMES) {
    check(
      `createPlugin() from dist/index.js must enable the '${ruleName}' rule`,
      esmRuleNames.includes(ruleName),
    );
  }
}

check(
  `plugin.meta.version in dist/index.js must be '${packageJson.version}', got '${esm.plugin?.meta?.version}'`,
  esm.plugin?.meta?.version === packageJson.version,
);

if (failures.length > 0) {
  console.error(`Smoke test failed with ${failures.length} error(s):`);
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exit(1);
}

console.log('Smoke test passed: dist CJS and ESM entries expose the expected API.');
