import type { RuleWithMetaAndName } from '@typescript-eslint/utils/eslint-utils';
import type { RuleModule } from '@typescript-eslint/utils/ts-eslint';
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';

const blobUrl = 'https://github.com/conarti/eslint-plugin-feature-sliced/blob/master/src/rules';

export const createEslintRule = RuleCreator(
  (ruleName) => `${blobUrl}/${ruleName}/index.test.ts`,
) as <TOptions extends readonly unknown[], TMessageIds extends string>(
  ruleDefinition: Readonly<RuleWithMetaAndName<TOptions, TMessageIds>>
) => RuleModule<TMessageIds, TOptions>;
