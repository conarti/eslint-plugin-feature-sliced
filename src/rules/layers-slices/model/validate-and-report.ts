import { AST_NODE_TYPES } from '@typescript-eslint/types';
import { type TSESTree } from '@typescript-eslint/utils';
import {
  extractPathsInfo,
  type PathsInfo,
} from '../../../lib/feature-sliced';
import {
  extractRuleOptions,
  hasPath,
  isIgnoredCurrentFile,
  isIgnoredTarget,
  isNodeType,
} from '../../../lib/rule';
import { type ImportNodes } from '../../../lib/rule/models';
import {
  type RuleContext,
  type Options,
} from '../config';
import { canImportLayer } from './can-import-layer';
import { validByLayerOrder } from './can-import-layer/valid-by-layer-order';
import { reportCanNotImportLayer, reportCanNotImportLayerAtSpecifier } from './errors-lib';
import { isNotSuitableForValidation } from './is-not-suitable-for-validation';

function extractImportSpecifiers(node: TSESTree.ImportDeclaration): TSESTree.ImportSpecifier[] {
  return node.specifiers.filter((specifier): specifier is TSESTree.ImportSpecifier => specifier.type === AST_NODE_TYPES.ImportSpecifier);
}

function validateNode<RuleOptions extends { allowTypeImports: boolean }>(node: ImportNodes, context: RuleContext, pathsInfo: PathsInfo, userDefinedRuleOptions: RuleOptions) {
  if (!canImportLayer(pathsInfo, node, userDefinedRuleOptions)) {
    reportCanNotImportLayer(context, node, pathsInfo);
  }
}

function validateSpecifiers(node: TSESTree.ImportDeclaration, context: RuleContext, pathsInfo: PathsInfo, allowTypeImports: boolean) {
  const specifiers = extractImportSpecifiers(node);

  const isValidImport = validByLayerOrder(pathsInfo.fsdPartsOfTarget, pathsInfo.fsdPartsOfCurrentFile);

  if (isValidImport) {
    return;
  }

  const invalidSpecifiers = specifiers.filter((specifier) => {
    const isType = isNodeType(specifier);
    const isValidByTypeImport = isType && allowTypeImports;
    return !isValidByTypeImport;
  });

  const allSpecifiersCount = specifiers.length;
  const invalidSpecifiersCount = invalidSpecifiers.length;
  const hasErrorsAtAllSpecifiers = invalidSpecifiersCount === allSpecifiersCount;

  if (hasErrorsAtAllSpecifiers) {
    reportCanNotImportLayer(context, node, pathsInfo);
  } else {
    invalidSpecifiers.forEach((specifier) => {
      reportCanNotImportLayerAtSpecifier(context, specifier, pathsInfo);
    });
  }
}

// TODO refactor this
export function validateAndReport(node: ImportNodes, context: RuleContext, optionsWithDefault: Readonly<Options>) {
  if (!hasPath(node)) {
    return;
  }

  const userDefinedRuleOptions = extractRuleOptions(optionsWithDefault);

  if (isIgnoredTarget(node, optionsWithDefault) || isIgnoredCurrentFile(context, optionsWithDefault)) {
    return;
  }

  const pathsInfo = extractPathsInfo(node, context);

  if (isNotSuitableForValidation(pathsInfo)) {
    return;
  }

  // FIXME combine into one function + refactor this
  const isValueNode = node.type === AST_NODE_TYPES.ImportDeclaration && node.importKind === 'value';
  if (isValueNode) {
    validateSpecifiers(node, context, pathsInfo, userDefinedRuleOptions.allowTypeImports);
  } else {
    validateNode(node, context, pathsInfo, userDefinedRuleOptions);
  }
}
