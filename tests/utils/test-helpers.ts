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
 * Стандартный CWD для всех тестов
 */
export const TEST_CWD = '/test/project';

/**
 * Создает путь к файлу относительно TEST_CWD
 */
export function makeFilename(relativePath: string): string {
  return `${TEST_CWD}/${relativePath}`;
}

/* === public-api helpers === */

/**
 * Создает ошибку public-api с suggestion для автофикса
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
 * Ошибка для импорта в public API слоя
 */
export const publicApiLayersNotAllowedError = {
  messageId: PUBLIC_API_MESSAGE_ID.LAYERS_PUBLIC_API_NOT_ALLOWED,
};

/**
 * Создает опции для public-api правила
 */
export function makePublicApiOptions({
  level = VALIDATION_LEVEL.SLICES,
  ignorePatterns = [],
  ignoreInFilesPatterns = [],
}: {
  level?: ValidationLevel;
  ignorePatterns?: string[];
  ignoreInFilesPatterns?: string[];
} = {}): PublicApiOptions {
  return [
    {
      level,
      ignorePatterns,
      ignoreInFilesPatterns,
    },
  ];
}

/* === layers-slices helpers === */

/**
 * Создает ошибку layers-slices
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
 * Позиция ошибки в коде
 */
export interface ErrorPosition {
  column: number;
  endColumn: number;
  line: number;
  endLine: number;
}

/**
 * Создает ошибку layers-slices с точной позицией
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
 * Опции для разрешения type imports
 */
export const layersSlicesAllowTypeImportsOptions: LayersSlicesOptions = [
  {
    allowTypeImports: true,
    ignorePatterns: [],
    ignoreInFilesPatterns: [],
  },
];

/**
 * Создает опции layers-slices с ignorePatterns
 */
export function makeLayersSlicesIgnoreOptions(patterns: string[]): LayersSlicesOptions {
  return [
    {
      allowTypeImports: true,
      ignorePatterns: patterns,
      ignoreInFilesPatterns: [],
    },
  ];
}

/**
 * Создает опции layers-slices с ignoreInFilesPatterns
 */
export function makeLayersSlicesIgnoreInFilesOptions(patterns: string[]): LayersSlicesOptions {
  return [
    {
      allowTypeImports: true,
      ignorePatterns: [],
      ignoreInFilesPatterns: patterns,
    },
  ];
}

/**
 * Создает ошибку для неверного @x cross-import
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
 * Ошибки для absolute-relative правила
 */
export const absoluteRelativeErrors = {
  mustBeAbsolute: { messageId: ABSOLUTE_RELATIVE_MESSAGE_ID.MUST_BE_ABSOLUTE_PATH },
  mustBeRelative: { messageId: ABSOLUTE_RELATIVE_MESSAGE_ID.MUST_BE_RELATIVE_PATH },
};

/**
 * Создает опции absolute-relative с ignorePatterns и ignoreInFilesPatterns
 */
export function makeAbsoluteRelativeOptions({
  ignorePatterns = [],
  ignoreInFilesPatterns = [],
}: {
  ignorePatterns?: string[];
  ignoreInFilesPatterns?: string[];
} = {}): AbsoluteRelativeOptions {
  return [
    {
      ignorePatterns,
      ignoreInFilesPatterns,
    },
  ];
}
