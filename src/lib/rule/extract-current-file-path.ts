import type { UnknownRuleContext } from './models';
import { normalizePath } from '../path';

export function extractCurrentFilePath(context: UnknownRuleContext) {
  /* Свойства physicalFilename/filename доступны в ESLint 10+, методы оставлены для совместимости с ESLint 9 */
  const currentFilePath = context.physicalFilename ?? context.filename
    ?? (context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename());
  return normalizePath(currentFilePath);
}
