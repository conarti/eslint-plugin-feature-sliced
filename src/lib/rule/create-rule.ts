import type { RuleWithMetaAndName } from '@typescript-eslint/utils/eslint-utils';
import type { Rule } from 'eslint';
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';

export interface RuleModule<
  T extends readonly unknown[],
> extends Rule.RuleModule {
  defaultOptions: T;
}

const blobUrl = 'https://github.com/conarti/eslint-plugin-feature-sliced/blob/master/src/rules';

export const createEslintRule = RuleCreator(
  (ruleName) => `${blobUrl}/${ruleName}/index.test.ts`,
) as any as <TOptions extends readonly unknown[], TMessageIds extends string>({ name, meta, ...rule }: Readonly<RuleWithMetaAndName<TOptions, TMessageIds>>) => RuleModule<TOptions>;
