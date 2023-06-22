import {
  convertToAbsolute,
  normalizePath,
} from '../path-lib';
import {
  type ImportExportNodesWithSourceValue,
  type UnknownRuleContext,
} from '../rule-lib';

function extractCurrentFilePath(context: UnknownRuleContext) {
  const currentFilePath = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename(); /* FIXME: getFilename is deprecated */
  const normalizedCurrentFilePath = normalizePath(currentFilePath);

  return {
    currentFilePath,
    normalizedCurrentFilePath,
  };
}

function extractNodePath(node: ImportExportNodesWithSourceValue) {
  const targetPath = node.source.value;
  const normalizedTargetPath = normalizePath(targetPath);

  return {
    targetPath,
    normalizedTargetPath,
  };
}

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
