import type { TSESTree } from '@typescript-eslint/utils';

export function hasErrorsAtAllSpecifiers(specifiers: TSESTree.ImportClause[], invalidSpecifiers: TSESTree.ImportClause[]): boolean {
  const allSpecifiersCount = specifiers.length;
  const invalidSpecifiersCount = invalidSpecifiers.length;
  return invalidSpecifiersCount === allSpecifiersCount;
}
