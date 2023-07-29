import { type TSESTree } from '@typescript-eslint/utils';
import { validByTypeImport } from '../validate-node/valid-by-type-import';

export function validateSpecifiers(specifiers: TSESTree.ImportSpecifier[], allowTypeImports: boolean): TSESTree.ImportSpecifier[] {
  return specifiers.filter((specifier) => !validByTypeImport(specifier, allowTypeImports));
}
