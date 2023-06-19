import path from 'path';
import { pathSeparator } from '../../config';

export function normalizePath(targetPath: string): string {
  const winSepRegExp = /\\/g;
  const withNormalizedSeparators = path
    .normalize(targetPath)
    .replace(winSepRegExp, pathSeparator);

  if (targetPath.startsWith('./')) {
    return `./${withNormalizedSeparators}`;
  }

  return withNormalizedSeparators;
}
