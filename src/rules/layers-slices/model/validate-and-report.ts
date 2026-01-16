import type { NormalizedLayerConfig } from '../../../config';
import type { ImportNodes } from '../../../lib/rule/models';
import type {
  Options,
  RuleContext,
} from '../config';
import {
  AST_NODE_TYPES,
  ASTUtils,
  type TSESTree,
} from '@typescript-eslint/utils';
import {
  canLayerAllowSliceCrossImports,
  extractCrossImportInfo,
  extractPathsInfo,
  normalizeLayersConfig,
  type PathsInfo,
} from '../../../lib/feature-sliced';
import {
  extractRuleOptions,
  hasPath,
  isIgnoredCurrentFile,
  isIgnoredTarget,
} from '../../../lib/rule';
import {
  reportCanNotImportLayer,
  reportInvalidCrossImport,
} from './errors';
import { isNotSuitableForValidation } from './is-not-suitable-for-validation';
import {
  hasErrorsAtAllSpecifiers,
  validateSpecifiers,
} from './specifiers';
import { extractImportSpecifiers } from './specifiers/extract-import-specifiers';
import { validateNode } from './validate-node';

function validate(
  node: ImportNodes,
  pathsInfo: PathsInfo,
  allowTypeImports: boolean,
  config?: NormalizedLayerConfig[],
): ImportNodes[] | TSESTree.ImportSpecifier[] {
  if (validateNode(node, pathsInfo, allowTypeImports, config)) {
    return [];
  }

  const isImportExpression = ASTUtils.isNodeOfType(AST_NODE_TYPES.ImportExpression)(node);
  if (isImportExpression) {
    return [node];
  }

  const specifiers = extractImportSpecifiers(node);
  const invalidSpecifiers = validateSpecifiers(specifiers, allowTypeImports);

  if (hasErrorsAtAllSpecifiers(specifiers, invalidSpecifiers)) {
    return [node];
  }

  return invalidSpecifiers;
}

function reportValidationErrors(
  nodes: TSESTree.ImportSpecifier[] | ImportNodes[],
  context: RuleContext,
  pathsInfo: PathsInfo,
  config: NormalizedLayerConfig[],
) {
  nodes.forEach((node) => reportCanNotImportLayer(context, node, pathsInfo, config));
}

export function validateAndReport(
  node: ImportNodes,
  context: RuleContext,
  optionsWithDefault: Readonly<Options>,
  config?: NormalizedLayerConfig[],
) {
  if (!hasPath(node)) {
    return;
  }

  const isIgnoredForValidation = isIgnoredTarget(node, optionsWithDefault) || isIgnoredCurrentFile(context, optionsWithDefault);
  if (isIgnoredForValidation) {
    return;
  }

  const pathsInfo = extractPathsInfo(node, context, config);

  /*
   * Check @x cross-import pattern.
   * @x is only allowed for entities layer.
   */
  const crossImportInfo = extractCrossImportInfo(pathsInfo.normalizedTargetPath);
  if (crossImportInfo.isCrossImport) {
    const currentFileSlice = pathsInfo.fsdPartsOfCurrentFile.slice;
    const isValidCrossImport = crossImportInfo.targetSlice === currentFileSlice;

    if (isValidCrossImport) {
      return;
    }

    reportInvalidCrossImport(context, node, crossImportInfo);
    return;
  }

  /*
   * Check allowSliceCrossImports for same-layer cross-slice imports.
   * If enabled for the target layer, allow imports between slices.
   */
  const layersConfig = config ?? normalizeLayersConfig();
  if (pathsInfo.isSameLayer && !pathsInfo.isSameSlice) {
    const targetLayer = pathsInfo.fsdPartsOfTarget.layer;
    if (targetLayer && canLayerAllowSliceCrossImports(targetLayer, layersConfig)) {
      return;
    }
  }

  if (isNotSuitableForValidation(pathsInfo)) {
    return;
  }

  const { allowTypeImports } = extractRuleOptions(optionsWithDefault);
  const nodesToReport = validate(node, pathsInfo, allowTypeImports, layersConfig);
  reportValidationErrors(nodesToReport, context, pathsInfo, layersConfig);
}
