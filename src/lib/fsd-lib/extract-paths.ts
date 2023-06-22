import { convertToAbsolute } from '../path-lib';
import {
  extractCurrentFilePath,
  extractNodePath,
  extractCwd,
  type ImportExportNodesWithSourceValue,
  type UnknownRuleContext,
} from '../rule-lib';

export function extractPaths(node: ImportExportNodesWithSourceValue, context: UnknownRuleContext) {
  const {
    currentFilePath,
    normalizedCurrentFilePath,
  } = extractCurrentFilePath(context);

  const {
    targetPath,
    normalizedTargetPath,
  } = extractNodePath(node);

  const absoluteTargetPath = convertToAbsolute(normalizedCurrentFilePath, normalizedTargetPath);

  const cwd = extractCwd(context);

  return {
    targetPath,
    currentFilePath,
    normalizedTargetPath,
    normalizedCurrentFilePath,
    absoluteTargetPath,
    normalizedCwd: cwd,
  };
}
