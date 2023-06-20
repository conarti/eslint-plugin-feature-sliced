import {
  convertToAbsolute,
  normalizePath,
} from '../path-lib';
import {
  type ImportExportNodesWithSourceValue,
  type UnknownRuleContext,
} from '../rule-lib';

export function extractPaths(node: ImportExportNodesWithSourceValue, context: UnknownRuleContext) {
  const targetPath = node.source.value;
  const currentFilePath = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename(); /* FIXME: getFilename is deprecated */

  const normalizedCurrentFilePath = normalizePath(currentFilePath);
  const normalizedTargetPath = normalizePath(targetPath);
  const absoluteTargetPath = convertToAbsolute(normalizedCurrentFilePath, normalizedTargetPath);

  return {
    targetPath,
    currentFilePath,
    normalizedTargetPath,
    normalizedCurrentFilePath,
    absoluteTargetPath,
  };
}
