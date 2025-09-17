import type { Linter } from 'eslint';
import { layers } from '../../config';

const LAYERS_REVERSED = [...layers].reverse();

export type ImportOrderRuleConfig = Linter.RuleEntry;

/**
 * Base configuration for import-order rule
 */
const baseConfig = {
  alphabetize: {
    order: 'asc' as const,
    caseInsensitive: true,
  },
  pathGroups: LAYERS_REVERSED.map((layer) => ({
    pattern: `**/?(*)${layer}{,/**}`,
    group: 'internal' as const,
    position: 'after' as const,
  })),
  distinctGroup: false,
  pathGroupsExcludedImportTypes: ['builtin'],
  groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
};

/**
 * Import order rule configurations
 */
export const importOrderRuleConfigs = {
  'recommended': [
    'error',
    {
      ...baseConfig,
      'newlines-between': 'never',
    },
  ] as ImportOrderRuleConfig,

  'with-newlines': [
    'error',
    {
      ...baseConfig,
      'newlines-between': 'always',
    },
  ] as ImportOrderRuleConfig,

  'with-type-group': [
    'error',
    {
      ...baseConfig,
      'newlines-between': 'never',
      'pathGroupsExcludedImportTypes': ['builtin', 'type'],
      'groups': ['builtin', 'external', 'internal', 'type', 'parent', 'sibling', 'index'],
    },
  ] as ImportOrderRuleConfig,

  'with-newlines-and-type-group': [
    'error',
    {
      ...baseConfig,
      'newlines-between': 'always',
      'pathGroupsExcludedImportTypes': ['builtin', 'type'],
      'groups': ['builtin', 'external', 'internal', 'type', 'parent', 'sibling', 'index'],
    },
  ] as ImportOrderRuleConfig,
} as const;
