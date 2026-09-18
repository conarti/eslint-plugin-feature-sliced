import type { Linter } from 'eslint';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import * as tseslintParser from '@typescript-eslint/parser';
import { ESLint } from 'eslint';
import { RULE_NAMES } from '../../src/config';
import featureSliced from '../../src/index';

/**
 * Integration test over a real on-disk FSD project.
 *
 * It runs ESLint 9 with the plugin built from `src` against
 * `tests/fixtures/basic-project` and compares the whole report with the
 * committed `expected.json` snapshot. See `tests/fixtures/basic-project/README.md`
 * for the fixture layout, the meaning of every expectation and the update workflow.
 */

interface NormalizedMessage {
  file: string;
  ruleId: string | null;
  messageId: string | null;
  line: number;
  column: number;
  suggestions: (string | null)[];
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const fixtureRoot = path.resolve(currentDir, '../fixtures/basic-project');
const expectedFilePath = path.join(fixtureRoot, 'expected.json');

const shouldUpdateExpectations = process.env.UPDATE_FIXTURE_EXPECTATIONS === '1';

const typescriptConfig: Linter.Config = {
  files: ['**/*.ts'],
  languageOptions: {
    parser: tseslintParser,
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
};

/**
 * The `src` subtree runs on the default options, the `src2` subtree
 * on the 'segments' public api level with a custom 'services' segment.
 */
const lintTargets = [
  {
    pattern: 'src/**/*.ts',
    config: featureSliced(),
  },
  {
    pattern: 'src2/**/*.ts',
    config: featureSliced({
      publicApi: { level: 'segments' },
      segments: ['services'],
    }),
  },
];

function toPosixRelativePath(absolutePath: string): string {
  return path.relative(fixtureRoot, absolutePath).split(path.sep).join('/');
}

/**
 * Locale-independent comparison: every sort in this file has to stay stable
 * across machines, so ordering is defined by code points only.
 */
function compareByCodePoint(first: string, second: string): number {
  if (first < second) {
    return -1;
  }

  return first > second ? 1 : 0;
}

function compareMessages(first: NormalizedMessage, second: NormalizedMessage): number {
  return compareByCodePoint(first.file, second.file)
    || first.line - second.line
    || first.column - second.column
    || compareByCodePoint(first.ruleId ?? '', second.ruleId ?? '')
    || compareByCodePoint(first.messageId ?? '', second.messageId ?? '');
}

/**
 * Number of TypeScript files physically present in the fixture project.
 * Guards the lint globs: a pattern that stops matching a subtree is caught here.
 */
function countFixtureTypescriptFiles(): number {
  return readdirSync(fixtureRoot, { encoding: 'utf8', recursive: true })
    .filter((entry) => entry.endsWith('.ts'))
    .length;
}

async function lintFixtureProject() {
  const messages: NormalizedMessage[] = [];
  const lintedFiles: string[] = [];
  const filesWithoutMessages: string[] = [];

  for (const { pattern, config } of lintTargets) {
    const eslint = new ESLint({
      cwd: fixtureRoot,
      overrideConfigFile: true,
      overrideConfig: [config, typescriptConfig],
    });

    const results = await eslint.lintFiles(pattern);

    for (const result of results) {
      const file = toPosixRelativePath(result.filePath);
      lintedFiles.push(file);

      if (result.messages.length === 0) {
        filesWithoutMessages.push(file);
      }

      for (const message of result.messages) {
        messages.push({
          file,
          ruleId: message.ruleId ?? null,
          messageId: message.messageId ?? null,
          line: message.line,
          column: message.column,
          suggestions: (message.suggestions ?? []).map((suggestion) => suggestion.messageId ?? null),
        });
      }
    }
  }

  return {
    messages: messages.sort(compareMessages),
    lintedFiles: lintedFiles.sort(compareByCodePoint),
    filesWithoutMessages: filesWithoutMessages.sort(compareByCodePoint),
  };
}

/**
 * Files that must stay free of any report: they prove the rules do not
 * produce false positives on a correct FSD structure.
 */
const filesExpectedToBeClean = [
  'src/app/providers/router.ts',
  'src/entities/(shop)/ShopA/index.ts',
  'src/entities/(shop)/ShopB/index.ts',
  'src/entities/(shop)/ShopB/ui/shop-b.ts',
  'src/entities/group/UserA/index.ts',
  'src/entities/group/UserB/index.ts',
  'src/entities/group/UserB/ui/user-b.ts',
  'src/entities/modal/model/index.ts',
  'src/entities/order/helpers/order-helper.ts',
  'src/entities/order/index.ts',
  'src/entities/order/services/order-service.ts',
  'src/entities/panel/other/index.ts',
  'src/entities/panel/other/ui/thing.ts',
  'src/entities/panel/panel/index.ts',
  'src/entities/panel/panel/model/index.ts',
  'src/entities/request-profile/model/index.ts',
  'src/entities/request-profile/model/profile.ts',
  'src/entities/services/model/index.ts',
  'src/entities/services/model/service-registry.ts',
  'src/entities/session/index.ts',
  'src/entities/session/model/index.ts',
  'src/entities/session/model/session-token.ts',
  'src/entities/ticket/handlers/index.ts',
  'src/entities/ticket/index.ts',
  'src/entities/ticket/notes/note.ts',
  'src/entities/user/@x/session.ts',
  'src/entities/user/api/fetch-user.ts',
  'src/entities/user/api/index.ts',
  'src/entities/user/index.ts',
  'src/entities/user/model/create-user.ts',
  'src/entities/user/model/type-only-upward-import.ts',
  'src/entities/user/model/valid-cross-import.ts',
  'src/entities/user/ui/user-card.ts',
  'src/features/auth/index.ts',
  'src/features/auth/model/auth-state.ts',
  'src/features/auth/model/login-user.ts',
  'src/features/auth/model/uses-entities-public-api.ts',
  'src/features/book/index.ts',
  'src/features/book/search/index.ts',
  'src/features/book/toggle-read/index.ts',
  'src/features/book/toggle-read/ui/toggle-read.ts',
  'src/features/profile/model/reexports-shared-type-inline.ts',
  'src/features/profile/model/uses-shared-helper.ts',
  'src/pages/home/index.ts',
  'src/pages/home/ui/home-page.ts',
  'src/pages/home/ui/imports-same-named-nested-slice.ts',
  'src/shared/lib/dynamic-locale-import.ts',
  'src/shared/lib/format-date.ts',
  'src/widgets/header/hooks/use-header.ts',
  'src/widgets/header/index.ts',
  'src/widgets/header/ui/header.ts',
  'src2/entities/basket/model/cross-import-at-segments-level.ts',
  'src2/entities/cart/services/cart-service.ts',
  'src2/entities/cart/services/helpers.ts',
  'src2/entities/cart/services/index.ts',
  'src2/entities/cart/ui/cart-view.ts',
  'src2/entities/invoice/helpers/invoice-helper.ts',
  'src2/entities/invoice/index.ts',
  'src2/entities/invoice/services/index.ts',
  'src2/entities/invoice/services/invoice-service.ts',
  'src2/features/payment/index.ts',
];

describe('fixture project', () => {
  let actualMessages: NormalizedMessage[];
  let lintedFiles: string[];
  let filesWithoutMessages: string[];

  beforeAll(async () => {
    const report = await lintFixtureProject();
    actualMessages = report.messages;
    lintedFiles = report.lintedFiles;
    filesWithoutMessages = report.filesWithoutMessages;

    if (shouldUpdateExpectations) {
      writeFileSync(expectedFilePath, `${JSON.stringify(actualMessages, null, 2)}\n`, 'utf8');
    }
  });

  it('reports exactly what expected.json describes', () => {
    if (shouldUpdateExpectations) {
      throw new Error(
        'expected.json has been rewritten from the current lint report. '
        + 'Review the diff and re-run the suite without UPDATE_FIXTURE_EXPECTATIONS=1.',
      );
    }

    expect(lintedFiles).toHaveLength(countFixtureTypescriptFiles());

    const expectedMessages = JSON.parse(readFileSync(expectedFilePath, 'utf8')) as NormalizedMessage[];

    expect(actualMessages).toEqual(expectedMessages);
  });

  it('keeps every rule of the plugin covered', () => {
    const reportedRuleIds = new Set(actualMessages.map((message) => message.ruleId));

    expect([...Object.values(RULE_NAMES)].filter((ruleId) => !reportedRuleIds.has(ruleId))).toEqual([]);
  });

  it('does not report on valid files', () => {
    expect(filesWithoutMessages).toEqual([...filesExpectedToBeClean].sort(compareByCodePoint));
  });
});
