import { normalizePath } from '../path-lib';
import { isUndefined } from '../shared';
import { type UnknownRuleContext } from './models';

export function extractCwd(context: UnknownRuleContext): string | undefined {
  const cwd = context.getCwd?.();

  if (isUndefined(cwd)) {
    return undefined;
  }

  return normalizePath(cwd);
}
