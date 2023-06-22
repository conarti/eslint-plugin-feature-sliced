import { normalizePath } from '../path-lib';
import { type UnknownRuleContext } from './models';

export function extractCwd(context: UnknownRuleContext) {
  const cwd = context.getCwd?.();
  const normalizedCwd = typeof cwd === 'string' ? normalizePath(cwd) : undefined;

  return normalizedCwd;
}
