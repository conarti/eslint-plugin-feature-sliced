import type { ImportExportSpecifier } from '../../../../lib/rule/models';
import { validByTypeImport } from '../validate-node/valid-by-type-import';

export function validateSpecifiers<TSpecifier extends ImportExportSpecifier>(specifiers: TSpecifier[], allowTypeImports: boolean): TSpecifier[] {
  return specifiers.filter((specifier) => !validByTypeImport(specifier, allowTypeImports));
}
