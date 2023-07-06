import { normalizePath } from '../path';
import { type ImportExportNodesWithSourceValue } from './models';

export function extractNodePath(node: ImportExportNodesWithSourceValue) {
  const targetPath = node.source.value;
  const normalizedTargetPath = normalizePath(targetPath);

  return {
    targetPath,
    normalizedTargetPath,
  };
}
