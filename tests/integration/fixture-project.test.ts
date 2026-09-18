import type { Linter } from 'eslint';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import * as tseslintParser from '@typescript-eslint/parser';
import { ESLint } from 'eslint';
import { PLUGIN_NAME, RULE_NAMES } from '../../src/config';
import featureSliced, { plugin } from '../../src/index';

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

/**
 * A message id is identified by the rule that owns it, because the same name may
 * belong to more than one rule and a suggestion carries no rule id of its own.
 */
function toMessageIdKey(ruleId: string, messageId: string): string {
  return `${ruleId} -> ${messageId}`;
}

/**
 * Every message id the plugin declares, read from the rule metadata the plugin exports
 * rather than from a hand-written list. A message id added to any rule therefore shows up
 * here on its own, and the fixture has to cover it or name the reason it cannot.
 */
function collectDeclaredMessageIds(): string[] {
  const declared: string[] = [];

  for (const [ruleName, rule] of Object.entries(plugin.rules)) {
    const ruleId = `${PLUGIN_NAME}/${ruleName}`;
    const messages: Record<string, string> = rule.meta?.messages ?? {};

    for (const messageId of Object.keys(messages)) {
      declared.push(toMessageIdKey(ruleId, messageId));
    }
  }

  return declared.sort(compareByCodePoint);
}

/**
 * Every message id the fixture actually produced. A suggestion counts as covered too:
 * it is attached to a message, so it belongs to the rule that reported it.
 */
function collectReportedMessageIds(messages: NormalizedMessage[]): Set<string> {
  const reported = new Set<string>();

  for (const message of messages) {
    if (message.ruleId === null) {
      continue;
    }

    if (message.messageId !== null) {
      reported.add(toMessageIdKey(message.ruleId, message.messageId));
    }

    for (const suggestion of message.suggestions) {
      if (suggestion !== null) {
        reported.add(toMessageIdKey(message.ruleId, suggestion));
      }
    }
  }

  return reported;
}

/**
 * Message ids the plugin declares that this fixture cannot produce, each with the reason.
 * The coverage assertion subtracts exactly these entries, so a message id can only leave the
 * fixture behind a written reason and never through a silent filter.
 *
 * All of them belong to `import-order`, which is `eslint-plugin-import-x`'s `order` rule
 * re-exported under the plugin name: the plugin owns the options it is given, not its message
 * catalogue, and these ids are gated behind option values no preset here produces.
 */
const messageIdsOutOfFixtureReach: Record<string, string> = {
  [toMessageIdKey(RULE_NAMES.IMPORT_ORDER, 'error')]:
    'reported only when the rule cannot convert its own options into ranks, and createPlugin builds those options itself, so no preset can reach it',
  [toMessageIdKey(RULE_NAMES.IMPORT_ORDER, 'noLineWithinGroup')]:
    'reported only when "newlines-between" is "always", which is the sortImports preset "with-newlines"; both subtrees here lint on the default "recommended" preset, which sets "never"',
  [toMessageIdKey(RULE_NAMES.IMPORT_ORDER, 'oneLineBetweenGroups')]:
    'reported only when "newlines-between" is "always", for the same reason as noLineWithinGroup',
  [toMessageIdKey(RULE_NAMES.IMPORT_ORDER, 'noLineBetweenSingleLineImport')]:
    'reported only when "consolidateIslands" is "inside-groups" and "newlines-between" is "always-and-inside-groups", and no sortImports preset sets either of them',
  [toMessageIdKey(RULE_NAMES.IMPORT_ORDER, 'oneLineBetweenTheMultiLineImport')]:
    'reported only under the same "consolidateIslands" pair as noLineBetweenSingleLineImport',
  [toMessageIdKey(RULE_NAMES.IMPORT_ORDER, 'oneLineBetweenThisMultiLineImport')]:
    'reported only under the same "consolidateIslands" pair as noLineBetweenSingleLineImport',
};

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

  it('keeps every message id of the plugin covered', () => {
    const reportedMessageIds = collectReportedMessageIds(actualMessages);

    const uncovered = collectDeclaredMessageIds()
      .filter((messageIdKey) => !reportedMessageIds.has(messageIdKey))
      .filter((messageIdKey) => !(messageIdKey in messageIdsOutOfFixtureReach));

    expect(uncovered).toEqual([]);
  });

  it('keeps the out of reach list free of stale entries', () => {
    const declaredMessageIds = new Set(collectDeclaredMessageIds());
    const reportedMessageIds = collectReportedMessageIds(actualMessages);

    const stale = Object.keys(messageIdsOutOfFixtureReach)
      .filter((messageIdKey) => !declaredMessageIds.has(messageIdKey) || reportedMessageIds.has(messageIdKey))
      .sort(compareByCodePoint);

    expect(stale).toEqual([]);
  });

  it('does not report on valid files', () => {
    expect(filesWithoutMessages).toEqual([...filesExpectedToBeClean].sort(compareByCodePoint));
  });
});
