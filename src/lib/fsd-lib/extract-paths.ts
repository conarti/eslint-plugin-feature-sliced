import {
  convertToAbsolute,
  normalizePath,
} from '../path-lib';
import {
  extractCurrentFilePath,
  extractNodePath,
  type ImportExportNodesWithSourceValue,
  type UnknownRuleContext,
} from '../rule-lib';

function extractCwd(context: UnknownRuleContext) {
  const cwd = context.getCwd?.();
  const normalizedCwd = typeof cwd === 'string' ? normalizePath(cwd) : undefined;

  return normalizedCwd;
}

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
