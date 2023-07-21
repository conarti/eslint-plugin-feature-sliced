import type {
  TSESTree,
  TSESLint,
} from '@typescript-eslint/utils';

/**
 *  Maybe TSESTree has an invalid type for this node.
 *  But maybe that's just my misunderstanding of how it works.
 *  https://astexplorer.net/#/gist/c72aaf4c7f7b4d57f554a4354f604d36/c416e580065f25d111fef37323e6001e2ea67ec1
 */
export type ImportExpression = TSESTree.ImportExpression & { source: TSESTree.StringLiteral }

export type ImportNodes = TSESTree.ImportDeclaration | ImportExpression;

export type ExportNodes = TSESTree.ExportAllDeclaration | TSESTree.ExportNamedDeclaration;

export type ImportExportNodes = ImportNodes | ExportNodes;

export type ImportNodesWithSource = ImportNodes;

export type ExportNodesWithSource = TSESTree.ExportAllDeclaration | TSESTree.ExportNamedDeclarationWithSource;

export type ImportExportNodesWithSourceValue = ImportNodesWithSource | ExportNodesWithSource;

type ImportKindType = { importKind: 'type' }
type ExportKindType = { exportKind: 'type' };

export type ImportDeclarationKindType = TSESTree.ImportDeclaration & ImportKindType;
export type ExportAllDeclarationKindType = TSESTree.ExportAllDeclaration & ExportKindType;
export type ExportNamedDeclarationKindType = TSESTree.ExportNamedDeclaration & ExportKindType

export type UnknownRuleContext = Readonly<TSESLint.RuleContext<string, unknown[]>>
