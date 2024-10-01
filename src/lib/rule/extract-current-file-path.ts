import type { UnknownRuleContext } from './models';
import { normalizePath } from '../path';

export function extractCurrentFilePath(context: UnknownRuleContext) {
  const currentFilePath = context.getPhysicalFilename
    ? context.getPhysicalFilename()
    : context.getFilename(); /* FIXME: getFilename is deprecated */
  return normalizePath(currentFilePath);
}
