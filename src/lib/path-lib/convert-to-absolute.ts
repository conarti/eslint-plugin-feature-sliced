import { joinPath } from './join-path';
import { isPathRelative } from './is-path-relative';

export function convertToAbsolute(base: string, target: string): string {
  if (target === '') {
    return base;
  }

  if (base === '') {
    return target;
  }

  if (!isPathRelative(target)) {
    return target;
  }

  return joinPath(base, `../${target}`);
}
