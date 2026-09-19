import type { NormalizedLayerConfig } from '../../../config';
import type {
  ExportNodesWithSource,
  ImportNodes,
} from '../../../lib/rule/models';
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
  extractCrossImportInfo,
  extractPathsInfo,
  type PathsInfo,
} from '../../../lib/feature-sliced';
import { normalizeLayersConfig } from '../../../lib/feature-sliced/layers-config';
import {
  extractRuleOptions,
  hasPath,
  isIgnoredCurrentFile,
  isIgnoredTarget,
} from '../../../lib/rule';
import {
  reportCanNotImportLayer,
  reportInvalidCrossImport,
  reportPassThroughReexport,
} from './errors';
import { isNotSuitableForValidation } from './is-not-suitable-for-validation';
import {
  hasErrorsAtAllSpecifiers,
  validateSpecifiers,
} from './specifiers';
import { extractExportSpecifiers } from './specifiers/extract-export-specifiers';
import { extractImportSpecifiers } from './specifiers/extract-import-specifiers';
import { validateNode } from './validate-node';
import { validByLayerOrder } from './validate-node/valid-by-layer-order';
import { validByTypeImport } from './validate-node/valid-by-type-import';

function validate(
  node: ImportNodes,
  pathsInfo: PathsInfo,
  allowTypeImports: boolean,
  config?: NormalizedLayerConfig[],
): ImportNodes[] | TSESTree.ImportClause[] {
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

function isReexport(node: ImportNodes | ExportNodesWithSource): node is ExportNodesWithSource {
  return ASTUtils.isNodeOfTypes([AST_NODE_TYPES.ExportAllDeclaration, AST_NODE_TYPES.ExportNamedDeclaration])(node);
}

/**
 * A named re-export is read per specifier, the way an import is: an inline `type` specifier is
 * exempt, a declaration whose every specifier is exempt says nothing at all, and a declaration
 * that mixes the two is reported at its value specifiers. `export * from` and `export * as ns
 * from` reach no specifier, so the declaration itself stays the only thing to report.
 */
function validateReexport(
  node: ExportNodesWithSource,
  allowTypeImports: boolean,
): (ExportNodesWithSource | TSESTree.ExportSpecifier)[] {
  const isExportAll = ASTUtils.isNodeOfType(AST_NODE_TYPES.ExportAllDeclaration)(node);
  if (isExportAll) {
    return [node];
  }

  const specifiers = extractExportSpecifiers(node);
  const invalidSpecifiers = validateSpecifiers(specifiers, allowTypeImports);

  if (hasErrorsAtAllSpecifiers(specifiers, invalidSpecifiers)) {
    return [node];
  }

  return invalidSpecifiers;
}

/**
 * A re-export is a dependency, so it takes the same checks as the equivalent import, and one
 * more that only a re-export can fail: forwarding a lower layer out through this file is a
 * pass-through, which the layer order on its own calls valid.
 */
function validateAndReportReexport(
  node: ExportNodesWithSource,
  context: RuleContext,
  pathsInfo: PathsInfo,
  ruleOptions: Options[0],
  layersConfig: NormalizedLayerConfig[],
) {
  if (validByTypeImport(node, ruleOptions.allowTypeImports)) {
    return;
  }

  const nodesToReport = validateReexport(node, ruleOptions.allowTypeImports);

  if (validByLayerOrder(pathsInfo.fsdPartsOfTarget, pathsInfo.fsdPartsOfCurrentFile, layersConfig)) {
    if (!ruleOptions.allowPassThroughReexports) {
      nodesToReport.forEach((nodeToReport) => reportPassThroughReexport(context, nodeToReport, pathsInfo));
    }

    return;
  }

  nodesToReport.forEach((nodeToReport) => reportCanNotImportLayer(context, nodeToReport, pathsInfo, layersConfig));
}

function reportValidationErrors(
  nodes: TSESTree.ImportClause[] | ImportNodes[],
  context: RuleContext,
  pathsInfo: PathsInfo,
  config: NormalizedLayerConfig[],
) {
  nodes.forEach((node) => reportCanNotImportLayer(context, node, pathsInfo, config));
}

export function validateAndReport(
  node: ImportNodes | ExportNodesWithSource,
  context: RuleContext,
  optionsWithDefault: Readonly<Options>,
  config?: NormalizedLayerConfig[],
  segmentsConfig?: string[],
) {
  if (!hasPath(node)) {
    return;
  }

  const isIgnoredForValidation = isIgnoredTarget(node, optionsWithDefault) || isIgnoredCurrentFile(context, optionsWithDefault);
  if (isIgnoredForValidation) {
    return;
  }

  const pathsInfo = extractPathsInfo(node, context, { layersConfig: config, segmentsConfig });

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

  if (isNotSuitableForValidation(pathsInfo, config)) {
    return;
  }

  const ruleOptions = extractRuleOptions(optionsWithDefault);
  const layersConfig = config ?? normalizeLayersConfig();

  if (isReexport(node)) {
    validateAndReportReexport(node, context, pathsInfo, ruleOptions, layersConfig);
    return;
  }

  const nodesToReport = validate(node, pathsInfo, ruleOptions.allowTypeImports, layersConfig);
  reportValidationErrors(nodesToReport, context, pathsInfo, layersConfig);
}
