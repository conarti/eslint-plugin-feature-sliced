import { isPathRelative } from './is-path-relative';
import { joinPath } from './join-path';

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
