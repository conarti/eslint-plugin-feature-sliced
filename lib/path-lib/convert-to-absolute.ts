import { joinPath } from './join-path';
import { isPathRelative } from './is-path-relative';

export function convertToAbsolute(fromPath: string, targetPath: string): string {
  if (targetPath === '') {
    return fromPath;
  }

  if (fromPath === '') {
    return targetPath;
  }

  if (!isPathRelative(targetPath)) {
    return targetPath;
  }

  return joinPath(fromPath, `../${targetPath}`);
}
