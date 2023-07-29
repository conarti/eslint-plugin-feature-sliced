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
} from '../../../lib/rule';
import { type ImportNodes } from '../../../lib/rule/models';
import {
  type Options,
  type RuleContext,
} from '../config';
import {
  reportCanNotImportLayer,
  reportCanNotImportLayerAtSpecifier,
} from './errors-lib';
import { isNotSuitableForValidation } from './is-not-suitable-for-validation';
import { validateNode } from './validate-node';
import { validByTypeImport } from './validate-node/valid-by-type-import';

function extractImportSpecifiers(node: TSESTree.ImportDeclaration): TSESTree.ImportSpecifier[] {
  return node.specifiers.filter((specifier): specifier is TSESTree.ImportSpecifier => specifier.type === AST_NODE_TYPES.ImportSpecifier);
}

function hasErrorsAtAllSpecifiers(specifiers: TSESTree.ImportSpecifier[], invalidSpecifiers: TSESTree.ImportSpecifier[]) {
  const allSpecifiersCount = specifiers.length;
  const invalidSpecifiersCount = invalidSpecifiers.length;
  return invalidSpecifiersCount === allSpecifiersCount;
}

function validateSpecifiers(specifiers: TSESTree.ImportSpecifier[], allowTypeImports: boolean) {
  return specifiers.filter((specifier) => !validByTypeImport(specifier, allowTypeImports));
}

function validate(
  node: ImportNodes,
  pathsInfo: PathsInfo,
  allowTypeImports: boolean,
): ImportNodes[] | TSESTree.ImportSpecifier[] {
  if (validateNode(node, pathsInfo, allowTypeImports)) {
    return [];
  }

  const isImportExpression = node.type === AST_NODE_TYPES.ImportExpression;
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
  function reportAtNode(node: TSESTree.ImportSpecifier | ImportNodes) {
    const reporters = {
      [AST_NODE_TYPES.ImportSpecifier]: reportCanNotImportLayerAtSpecifier,
      [AST_NODE_TYPES.ImportDeclaration]: reportCanNotImportLayer,
      [AST_NODE_TYPES.ImportExpression]: reportCanNotImportLayer,
    };

    const report = reporters[node.type];

    /* FIXME */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    report(context, node, pathsInfo);
  }

  nodes.forEach(reportAtNode);
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
