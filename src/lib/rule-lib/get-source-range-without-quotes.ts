import type { TSESTree } from '@typescript-eslint/utils';

export function getSourceRangeWithoutQuotes([rangeStart, rangeEnd]: TSESTree.Range): TSESTree.Range {
  return [rangeStart + 1, rangeEnd - 1];
}
