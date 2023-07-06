import path from 'path';
import { normalizePath } from './normalize-path';

export function joinPath(from: string, to: string): string {
  return normalizePath(path.join(normalizePath(from), normalizePath(to)));
}
