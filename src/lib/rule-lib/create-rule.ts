import { URL } from 'url';
import { ESLintUtils } from '@typescript-eslint/utils';
import { RULE_DOCS_URL } from '../../config';

export const createRule = ESLintUtils.RuleCreator(
  (name) => new URL(name, RULE_DOCS_URL).toString(),
);
