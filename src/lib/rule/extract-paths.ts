import type {
  ImportExportNodesWithSourceValue,
  UnknownRuleContext,
} from './models';
import { convertToAbsolute } from '../path';
import { extractCurrentFilePath } from './extract-current-file-path';
import { extractCwd } from './extract-cwd';
import { extractNodePath } from './extract-node-path';

export function extractPaths(node: ImportExportNodesWithSourceValue, context: UnknownRuleContext) {
  const normalizedCurrentFilePath = extractCurrentFilePath(context);

  const {
    targetPath,
    normalizedTargetPath,
  } = extractNodePath(node);

  const absoluteTargetPath = convertToAbsolute(normalizedCurrentFilePath, normalizedTargetPath);

  const cwd = extractCwd(context);

  return {
    targetPath,
    normalizedTargetPath,
    normalizedCurrentFilePath,
    absoluteTargetPath,
    normalizedCwd: cwd,
  };
}
