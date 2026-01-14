import type { TSESLint } from '@typescript-eslint/utils';
import type { Layer } from '../../src/config';
import {
  ERROR_MESSAGE_ID as ABSOLUTE_RELATIVE_MESSAGE_ID,
  type Options as AbsoluteRelativeOptions,
} from '../../src/rules/absolute-relative/config';
import {
  ERROR_MESSAGE_ID as LAYERS_SLICES_MESSAGE_ID,
  type MessageIds as LayersSlicesMessageIds,
  type Options as LayersSlicesOptions,
} from '../../src/rules/layers-slices/config';
import {
  MESSAGE_ID as PUBLIC_API_MESSAGE_ID,
  type Options as PublicApiOptions,
  VALIDATION_LEVEL,
  type ValidationLevel,
} from '../../src/rules/public-api/config';

/**
 * Standard CWD for all tests
 */
export const TEST_CWD = '/test/project';

/**
 * Creates a file path relative to TEST_CWD
 */
export function makeFilename(relativePath: string): string {
  return `${TEST_CWD}/${relativePath}`;
}

/* === public-api helpers === */

/**
 * Creates public-api error with autofix suggestion
 */
export function makePublicApiErrorWithSuggestion(
  suggestionSegments: string,
  suggestionOutput: string,
  fixedPath: string,
) {
  return {
    messageId: PUBLIC_API_MESSAGE_ID.SHOULD_BE_FROM_PUBLIC_API,
    data: {
      fixedPath,
    },
    suggestions: [
      {
        messageId: PUBLIC_API_MESSAGE_ID.REMOVE_SUGGESTION,
        data: {
          valueToRemove: suggestionSegments,
        },
        output: suggestionOutput,
      },
    ],
  };
}

/**
 * Error for import in layer public API
 */
export const publicApiLayersNotAllowedError = {
  messageId: PUBLIC_API_MESSAGE_ID.LAYERS_PUBLIC_API_NOT_ALLOWED,
};

/**
 * Creates options for public-api rule
 */
export function makePublicApiOptions({
  level = VALIDATION_LEVEL.SLICES,
  ignoreImports = [],
  ignoreFiles = [],
}: {
  level?: ValidationLevel;
  ignoreImports?: string[];
  ignoreFiles?: string[];
} = {}): PublicApiOptions {
  return [
    {
      level,
      ignoreImports,
      ignoreFiles,
    },
  ];
}

/* === layers-slices helpers === */

/**
 * Creates layers-slices error
 */
export function makeLayersSlicesError(
  importLayer: Layer,
  currentFileLayer: Layer,
): TSESLint.TestCaseError<LayersSlicesMessageIds> {
  return {
    messageId: LAYERS_SLICES_MESSAGE_ID.CAN_NOT_IMPORT,
    data: {
      importLayer,
      currentFileLayer,
    },
  };
}

/**
 * Error position in code
 */
export interface ErrorPosition {
  column: number;
  endColumn: number;
  line: number;
  endLine: number;
}

/**
 * Creates layers-slices error with exact position
 */
export function makeLayersSlicesErrorAtSpecifier(
  importLayer: Layer,
  currentFileLayer: Layer,
  position: ErrorPosition,
): TSESLint.TestCaseError<LayersSlicesMessageIds> {
  return {
    messageId: LAYERS_SLICES_MESSAGE_ID.CAN_NOT_IMPORT,
    data: {
      importLayer,
      currentFileLayer,
    },
    column: position.column,
    endColumn: position.endColumn,
    line: position.line,
    endLine: position.endLine,
  };
}

/**
 * Options for allowing type imports
 */
export const layersSlicesAllowTypeImportsOptions: LayersSlicesOptions = [
  {
    allowTypeImports: true,
    ignoreImports: [],
    ignoreFiles: [],
  },
];

/**
 * Creates layers-slices options with ignoreImports
 */
export function makeLayersSlicesIgnoreOptions(patterns: string[]): LayersSlicesOptions {
  return [
    {
      allowTypeImports: true,
      ignoreImports: patterns,
      ignoreFiles: [],
    },
  ];
}

/**
 * Creates layers-slices options with ignoreFiles
 */
export function makeLayersSlicesIgnoreInFilesOptions(patterns: string[]): LayersSlicesOptions {
  return [
    {
      allowTypeImports: true,
      ignoreImports: [],
      ignoreFiles: patterns,
    },
  ];
}

/**
 * Creates error for invalid @x cross-import
 */
export function makeInvalidCrossImportError(
  sourceSlice: string,
  targetSlice: string,
): TSESLint.TestCaseError<LayersSlicesMessageIds> {
  return {
    messageId: LAYERS_SLICES_MESSAGE_ID.INVALID_CROSS_IMPORT,
    data: {
      sourceSlice,
      targetSlice,
    },
  };
}

/* === absolute-relative helpers === */

/**
 * Errors for absolute-relative rule
 */
export const absoluteRelativeErrors = {
  mustBeAbsolute: { messageId: ABSOLUTE_RELATIVE_MESSAGE_ID.MUST_BE_ABSOLUTE_PATH },
  mustBeRelative: { messageId: ABSOLUTE_RELATIVE_MESSAGE_ID.MUST_BE_RELATIVE_PATH },
};

/**
 * Creates absolute-relative options with ignoreImports and ignoreFiles
 */
export function makeAbsoluteRelativeOptions({
  ignoreImports = [],
  ignoreFiles = [],
}: {
  ignoreImports?: string[];
  ignoreFiles?: string[];
} = {}): AbsoluteRelativeOptions {
  return [
    {
      ignoreImports,
      ignoreFiles,
    },
  ];
}
