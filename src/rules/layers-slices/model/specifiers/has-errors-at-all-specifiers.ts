import type { ImportExportSpecifier } from '../../../../lib/rule/models';

export function hasErrorsAtAllSpecifiers(specifiers: ImportExportSpecifier[], invalidSpecifiers: ImportExportSpecifier[]): boolean {
  const allSpecifiersCount = specifiers.length;
  const invalidSpecifiersCount = invalidSpecifiers.length;
  return invalidSpecifiersCount === allSpecifiersCount;
}
