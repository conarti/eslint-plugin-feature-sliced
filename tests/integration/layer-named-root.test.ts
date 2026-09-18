import type { Linter } from 'eslint';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
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
 * `shared` is the name used here on purpose: it is a layer that holds no slices, so only the
 * re-rooting of the target reads it as a layer and this suite pins that one step rather than
 * the rest of the resolution.
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
 * Two shapes that the filesystem resolution decides and the path heuristic does not.
 *
 * `(shop)` holds two slices that each carry a public api, so reaching into the `ui` folder of
 * the sibling has to go through it. `order` carries a public api while `entities/services`
 * carries none, so the second import is the case where one unresolved side sends both sides
 * back to the heuristic and the two agree there.
 */
const PROJECT_FILES: Record<string, string> = {
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

function createProjectUnder(ancestorName: string): string {
  const root = path.join(mkdtempSync(path.join(tmpdir(), 'fsd-layer-root-')), ancestorName, 'proj');

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
