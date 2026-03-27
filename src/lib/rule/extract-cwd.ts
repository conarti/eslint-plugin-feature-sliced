import type { UnknownRuleContext } from './models';
import { normalizePath } from '../path';
import { isUndefined } from '../shared';

export function extractCwd(context: UnknownRuleContext): string | undefined {
  /* Свойство cwd доступно в ESLint 10+, метод getCwd оставлен для совместимости с ESLint 9 */
  const cwd = context.cwd ?? context.getCwd?.();

  if (isUndefined(cwd)) {
    return undefined;
  }

  return normalizePath(cwd);
}
