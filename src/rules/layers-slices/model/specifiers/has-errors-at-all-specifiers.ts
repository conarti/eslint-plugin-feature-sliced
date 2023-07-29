import { type TSESTree } from '@typescript-eslint/utils';

export function hasErrorsAtAllSpecifiers(specifiers: TSESTree.ImportSpecifier[], invalidSpecifiers: TSESTree.ImportSpecifier[]): boolean {
  const allSpecifiersCount = specifiers.length;
  const invalidSpecifiersCount = invalidSpecifiers.length;
  return invalidSpecifiersCount === allSpecifiersCount;
}
