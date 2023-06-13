import type { TSESTree } from '@typescript-eslint/utils';

export type ImportExportNodes = TSESTree.ImportDeclaration
	| TSESTree.ImportExpression
	| TSESTree.ExportAllDeclaration
	| TSESTree.ExportNamedDeclaration;
