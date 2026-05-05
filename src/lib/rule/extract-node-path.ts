import type { ImportExportNodesWithSourceValue } from './models';
import { normalizePath } from '../path';

export function extractNodePath(node: ImportExportNodesWithSourceValue) {
  const targetPath = node.source.value;
  const normalizedTargetPath = normalizePath(targetPath);

  return {
    targetPath,
    normalizedTargetPath,
  };
}
