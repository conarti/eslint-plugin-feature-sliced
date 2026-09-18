import type { TSESTree } from '@typescript-eslint/utils';
import { validByTypeImport } from '../validate-node/valid-by-type-import';

export function validateSpecifiers(specifiers: TSESTree.ImportClause[], allowTypeImports: boolean): TSESTree.ImportClause[] {
  return specifiers.filter((specifier) => !validByTypeImport(specifier, allowTypeImports));
}
