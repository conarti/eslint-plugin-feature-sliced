import type { Linter as LinterTypes } from 'eslint';
import type { TypedFlatConfigItem } from '../../config';
import path from 'node:path';
import process from 'node:process';
import * as tseslintParser from '@typescript-eslint/parser';
import { Linter } from 'eslint';
import { PLUGIN_NAME, RULE_NAMES } from '../../config';
import { normalizeLayersConfig } from '../../lib/feature-sliced/layers-config';
import { plugin } from '../../plugin';

/**
 * `settings['@conarti/feature-sliced']` is plain ESLint configuration, so it can be written by
 * hand, and by hand the layers are written as a list of names. `createPlugin` never emits that
 * shape, so nothing downstream used to normalize it.
 *
 * These cases go through the linter rather than the rule tester because the defect they pin is
 * that the file is abandoned: a throw inside a rule takes the whole lint of that file with it,
 * and the user is shown a plugin stack trace instead of a report. The paths are absolute and
 * under the working directory, which is what ESLint hands a rule and what the reroot step needs
 * before it reads any layer name at all.
 */

const linter = new Linter();

function makeConfig(layers: unknown): TypedFlatConfigItem[] {
  return [
    {
      files: ['**/*.ts'],
      plugins: {
        [PLUGIN_NAME]: plugin,
      },
      languageOptions: {
        parser: tseslintParser,
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      settings: {
        [PLUGIN_NAME]: {
          layers,
        },
      },
      rules: {
        [RULE_NAMES.LAYERS_SLICES]: 'error',
        [RULE_NAMES.PUBLIC_API]: 'error',
        [RULE_NAMES.ABSOLUTE_RELATIVE]: 'error',
      },
    },
  ];
}

const PLAIN_LAYER_NAMES = ['shared', 'entities', 'features', 'widgets', 'pages', 'processes', 'app'];

const MIXED_LAYERS = [{ name: 'shared', hasSlices: false }, 'entities', 'features'];

/** A file under the working directory, which is the shape ESLint hands a rule */
function projectPath(relativePath: string): string {
  return path.join(process.cwd(), relativePath);
}

const CASES = [
  {
    name: 'a deep import into another layer',
    code: "import { User } from '@/entities/user/model'",
    filename: projectPath('src/features/auth/ui/form.ts'),
  },
  {
    name: 'an import of a higher layer',
    code: "import { User } from '@/entities/user'",
    filename: projectPath('src/shared/ui/button.ts'),
  },
  {
    name: 'a layer public api',
    code: "export { User } from './user'",
    filename: projectPath('src/entities/index.ts'),
  },
] as const;

function lint(layers: unknown, code: string, filename: string) {
  return linter.verify(code, makeConfig(layers), filename);
}

function ruleIdsOf(messages: LinterTypes.LintMessage[]): string[] {
  return messages.map((message) => message.ruleId ?? 'none').sort();
}

describe('layers settings written by hand', () => {
  describe.each(CASES)('$name', ({ code, filename }) => {
    it('should not abandon the file when the layers are a plain list of names', () => {
      expect(() => lint(PLAIN_LAYER_NAMES, code, filename)).not.toThrow();
    });

    it('should answer a plain list of names exactly as it answers the normalized list', () => {
      expect(lint(PLAIN_LAYER_NAMES, code, filename))
        .toEqual(lint(normalizeLayersConfig(PLAIN_LAYER_NAMES), code, filename));
    });

    it('should answer a mixed list of names and objects exactly as it answers the normalized list', () => {
      expect(lint(MIXED_LAYERS, code, filename))
        .toEqual(lint(normalizeLayersConfig(MIXED_LAYERS), code, filename));
    });

    it('should not abandon the file when an entry can name no layer', () => {
      expect(() => lint([42, null, {}, { name: '' }, ''], code, filename)).not.toThrow();
    });

    it('should fall back to the defaults when an entry can name no layer', () => {
      expect(lint([42, null, {}], code, filename)).toEqual(lint(undefined, code, filename));
    });

    it('should keep honouring an empty list as a project with no layers', () => {
      expect(ruleIdsOf(lint([], code, filename))).not.toContain(RULE_NAMES.LAYERS_SLICES);
    });
  });

  /*
   * The comparisons above are only worth something if the configuration they compare
   * actually reports, so one case pins a report that the plain list used to lose.
   */
  it('should report a cross-layer import for a plain list of names', () => {
    const messages = lint(
      PLAIN_LAYER_NAMES,
      "import { User } from '@/entities/user'",
      projectPath('src/shared/ui/button.ts'),
    );

    expect(ruleIdsOf(messages)).toContain(RULE_NAMES.LAYERS_SLICES);
  });
});
