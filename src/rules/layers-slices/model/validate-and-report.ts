import {
  type TSESTree,
  AST_NODE_TYPES,
  ASTUtils,
} from '@typescript-eslint/utils';
import {
  extractPathsInfo,
  type PathsInfo,
} from '../../../lib/feature-sliced';
import {
  extractRuleOptions,
  hasPath,
  isIgnoredCurrentFile,
  isIgnoredTarget,
} from '../../../lib/rule';
import { type ImportNodes } from '../../../lib/rule/models';
import {
  type Options,
  type RuleContext,
} from '../config';
import { reportCanNotImportLayer } from './errors';
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
): ImportNodes[] | TSESTree.ImportSpecifier[] {
  if (validateNode(node, pathsInfo, allowTypeImports)) {
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

function reportValidationErrors(nodes: TSESTree.ImportSpecifier[] | ImportNodes[], context: RuleContext, pathsInfo: PathsInfo) {
  nodes.forEach((node) => reportCanNotImportLayer(context, node, pathsInfo));
}

export function validateAndReport(node: ImportNodes, context: RuleContext, optionsWithDefault: Readonly<Options>) {
  if (!hasPath(node)) {
    return;
  }

  const isIgnoredForValidation = isIgnoredTarget(node, optionsWithDefault) || isIgnoredCurrentFile(context, optionsWithDefault);
  if (isIgnoredForValidation) {
    return;
  }

  const pathsInfo = extractPathsInfo(node, context);

  if (isNotSuitableForValidation(pathsInfo)) {
    return;
  }

  const { allowTypeImports } = extractRuleOptions(optionsWithDefault);
  const nodesToReport = validate(node, pathsInfo, allowTypeImports);
  reportValidationErrors(nodesToReport, context, pathsInfo);
}
