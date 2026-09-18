import type { Linter } from 'eslint';
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as tseslintParser from '@typescript-eslint/parser';
import { ESLint } from 'eslint';
import featureSliced from '../../src/index';

/**
 * A project whose checkout sits under a directory carrying a layer name.
 *
 * Nothing forbids holding several checkouts in a folder called `shared` or `app`, and the
 * rules only ever see absolute paths, so such a folder is indistinguishable from a layer
 * unless the search for one starts below the project root. When it is not, the target of a
 * relative import is rebuilt under the wrong directory, the probe for its public api finds
 * nothing, and the never-mix rule takes both sides of every comparison back to the path
 * heuristic. The whole filesystem resolution then answers nothing at all.
 *
 * `shared` is the name the first block below uses on purpose: it is a layer that holds no
 * slices, so only the re-rooting of the target reads it as a layer, and that block pins that
 * one step rather than the rest of the resolution. A layer that holds slices is read by four
 * further searches, so the blocks after it compare the whole report set against the same
 * project under a neutral parent, which is the only statement that covers all of them.
 */

const typescriptConfig: Linter.Config = {
  files: ['**/*.ts'],
  languageOptions: {
    parser: tseslintParser,
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
};

/**
 * Two shapes that the filesystem resolution decides and the path heuristic does not, plus one
 * that carries no layer at all.
 *
 * `(shop)` holds two slices that each carry a public api, so reaching into the `ui` folder of
 * the sibling has to go through it. `order` carries a public api while `entities/services`
 * carries none, so the second import is the case where one unresolved side sends both sides
 * back to the heuristic and the two agree there. `main.ts` sits above every layer and reaches
 * a folder named after a configured segment, which is a path the name list route reads and the
 * filesystem resolution does not: it holds no layer, so under a neutral parent it holds no
 * segment either.
 */
const PROJECT_FILES: Record<string, string> = {
  'src/main.ts': 'import { style } from \'./assets/index\';\n\nexport const main = style;\n',
  'src/assets/index.ts': 'export const style = \'s\';\n',
  'src/entities/(shop)/ShopA/index.ts': 'export { shopA } from \'./ui/shop-a\';\n',
  'src/entities/(shop)/ShopA/ui/shop-a.ts': 'import { shopB } from \'../../ShopB/ui/shop-b\';\n\nexport const shopA = \'a-\' + shopB;\n',
  'src/entities/(shop)/ShopB/index.ts': 'export { shopB } from \'./ui/shop-b\';\n',
  'src/entities/(shop)/ShopB/ui/shop-b.ts': 'export const shopB = \'b\';\n',
  'src/entities/order/index.ts': 'export { orderService } from \'./services/order-service\';\n',
  'src/entities/order/helpers/order-helper.ts': 'export const orderHelper = \'helper\';\n',
  'src/entities/order/services/order-service.ts': 'import { serviceRegistry } from \'../../services/model/service-registry\';\nimport { orderHelper } from \'../helpers/order-helper\';\n\nexport const orderService = \'order-\' + orderHelper + serviceRegistry;\n',
  'src/entities/services/model/index.ts': 'export { serviceRegistry } from \'./service-registry\';\n',
  'src/entities/services/model/service-registry.ts': 'export const serviceRegistry = \'registry\';\n',
};

/**
 * Every `mkdtemp` root a helper below has created, so `afterAll` can remove exactly those and
 * nothing else. Only the `mkdtemp` root goes here, never the project nested under it, and never
 * `tmpdir()` itself: another test file may be using its own directories under the same parent.
 */
const createdRoots: string[] = [];

function createProjectUnder(ancestorName: string): string {
  const mkdtempRoot = mkdtempSync(path.join(tmpdir(), 'fsd-layer-root-'));
  createdRoots.push(mkdtempRoot);
  const root = path.join(mkdtempRoot, ancestorName, 'proj');

  for (const [relativePath, contents] of Object.entries(PROJECT_FILES)) {
    const filePath = path.join(root, relativePath);
    mkdirSync(path.dirname(filePath), { recursive: true });
    writeFileSync(filePath, contents, 'utf8');
  }

  return root;
}

async function lintProject(root: string): Promise<string[]> {
  const eslint = new ESLint({
    cwd: root,
    overrideConfigFile: true,
    overrideConfig: [featureSliced(), typescriptConfig],
  });

  const results = await eslint.lintFiles('src/**/*.ts');

  return results.flatMap((result) => {
    const file = path.relative(root, result.filePath).split(path.sep).join('/');
    return result.messages.map((message) => `${file} ${message.ruleId} ${message.messageId}`);
  }).sort();
}

describe('project checked out under a layer named directory', () => {
  let reports: string[];

  beforeAll(async () => {
    reports = await lintProject(createProjectUnder('shared'));
  });

  it('reports the deep import into a sibling slice under a group folder', () => {
    expect(reports).toContain('src/entities/(shop)/ShopA/ui/shop-a.ts @conarti/feature-sliced/public-api should-be-from-public-api');
  });

  it('stays silent on the import that only one unresolved side keeps valid', () => {
    expect(reports.filter((report) => report.startsWith('src/entities/order/services/order-service.ts'))).toEqual([]);
  });
});

/*
 * Every configured layer name, not only the two that hold no slices. A layer that holds slices
 * is read by the slice containment check, by the segment derived from a resolved boundary, by
 * the segment derived from the configured name list and by the cross-segment re-export check
 * as well, and each of those searches a whole absolute path. `main.ts` above is the shape only
 * the name list route answers.
 */
const EVERY_LAYER_NAME = ['shared', 'app', 'entities', 'features', 'widgets', 'pages', 'processes'] as const;

describe('the same project under a parent named after every configured layer', () => {
  let neutral: string[];

  beforeAll(async () => {
    neutral = await lintProject(createProjectUnder('neutral'));
  });

  it('reports the deep import into a sibling slice and nothing on the file above the layers', () => {
    expect(neutral).toEqual([
      'src/entities/(shop)/ShopA/ui/shop-a.ts @conarti/feature-sliced/layers-slices can-not-import',
      'src/entities/(shop)/ShopA/ui/shop-a.ts @conarti/feature-sliced/public-api should-be-from-public-api',
    ]);
  });

  it.each(EVERY_LAYER_NAME)('answers under a parent named %s exactly as under a neutral one', async (ancestorName) => {
    expect(await lintProject(createProjectUnder(ancestorName))).toEqual(neutral);
  });
});

/*
 * The same statement over a far richer project: the repository's own fixture, which already
 * carries every shape the four searches answer differently, and carries them next to the
 * reports each one is supposed to produce. A group folder, a slice holding a folder of its own
 * name, a segment absent from the configured list, a slice reached from its own layer, an `@x`
 * cross-import, and a second subtree linted at the segments level with a custom segment.
 */

const LAYERS_WITH_SLICES = ['entities', 'features', 'widgets', 'pages', 'processes'] as const;

const fixtureRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../fixtures/basic-project');

/**
 * The fixture's two subtrees, each linted with the configuration it was written for.
 */
const FIXTURE_SUBTREES = [
  { pattern: 'src/**/*.ts', config: featureSliced() },
  { pattern: 'src2/**/*.ts', config: featureSliced({ publicApi: { level: 'segments' }, segments: ['services'] }) },
];

function copyFixtureUnder(ancestorName: string): string {
  const mkdtempRoot = mkdtempSync(path.join(tmpdir(), 'fsd-layer-root-'));
  createdRoots.push(mkdtempRoot);
  const root = path.join(mkdtempRoot, ancestorName, 'proj');

  mkdirSync(path.dirname(root), { recursive: true });
  cpSync(path.join(fixtureRoot, 'src'), path.join(root, 'src'), { recursive: true });
  cpSync(path.join(fixtureRoot, 'src2'), path.join(root, 'src2'), { recursive: true });

  return root;
}

async function lintFixtureCopy(root: string): Promise<string[]> {
  const reports: string[] = [];

  for (const subtree of FIXTURE_SUBTREES) {
    const eslint = new ESLint({
      cwd: root,
      overrideConfigFile: true,
      overrideConfig: [subtree.config, typescriptConfig],
    });

    const results = await eslint.lintFiles(subtree.pattern);

    for (const result of results) {
      const file = path.relative(root, result.filePath).split(path.sep).join('/');
      for (const message of result.messages) {
        reports.push(`${file}:${message.line}:${message.column} ${message.ruleId} ${message.messageId}`);
      }
    }
  }

  return reports.sort();
}

describe('fixture project checked out under a directory named after a layer that holds slices', () => {
  let neutral: string[];

  beforeAll(async () => {
    neutral = await lintFixtureCopy(copyFixtureUnder('neutral'));
  });

  it('reports something at all under a neutral parent, so an empty answer cannot pass', () => {
    expect(neutral.length).toBeGreaterThan(20);
  });

  it.each(LAYERS_WITH_SLICES)('answers under a parent named %s exactly as under a neutral one', async (ancestorName) => {
    expect(await lintFixtureCopy(copyFixtureUnder(ancestorName))).toEqual(neutral);
  });
});

/*
 * Every project built above lives under its own `mkdtemp` root, so removing exactly those roots
 * here clears every one of them, pass or fail, without touching `tmpdir()` itself or another
 * test file's directories under it.
 */
afterAll(() => {
  for (const root of createdRoots) {
    rmSync(root, { recursive: true, force: true });
  }
});
