const rule = require('./index');
const { RuleTester } = require('eslint');
const { MESSAGE_ID } = require('./constants');

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

const makeErrorWithSuggestion = (suggestionSegments, suggestionOutput, fixedPath) => ({
  messageId: MESSAGE_ID.SHOULD_BE_FROM_PUBLIC_API,
  data: {
    fixedPath,
  },
  suggestions: [
    {
      messageId: MESSAGE_ID.REMOVE_SUGGESTION,
      data: {
        segments: suggestionSegments,
      },
      output: suggestionOutput,
    },
  ],
});

ruleTester.run('public-api-imports', rule, {
  valid: [
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'../../model/slices/addCommentFormSlice\'',
      errors: [],
    },
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article\'',
      errors: [],
    },
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'src/entities/Article\'',
      errors: [],
    },
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'some/root/path/entities/Article\'',
      errors: [],
    },
    {
      code: 'import { setStylesForTheme } from \'app/providers/ThemeProvider\'',
      errors: [],
    },
    {
      code: 'import { formConfig } from \'src/features/form/config\'',
      filename: 'src/features/form/ui/index.js',
      errors: [],
    },
    {
      code: 'import { ThemeSwitcher } from \'shared/ui/ThemeSwitcher\';',
      filename: 'src/features/form/ui/index.js',
      errors: [],
    },
    {
      code: 'import { foo } from \'shared/lib/foo\';',
      filename: 'src/features/form/ui/index.js',
      errors: [],
    },
  ],

  invalid: [
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'entities/Article/model/file.ts\'',
      errors: [
        makeErrorWithSuggestion(
          'model/file.ts',
          'import { addCommentFormActions, addCommentFormReducer } from \'entities/Article\'',
          'entities/Article',
        ),
      ],
    },
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article/model/file.ts\'',
      errors: [
        makeErrorWithSuggestion(
          'model/file.ts',
          'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article\'',
          '@/entities/Article'
        ),
      ],
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article/testing/file.tsx\'',
      errors: [
        makeErrorWithSuggestion(
          'testing/file.tsx',
          'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article\'',
          '@/entities/Article'
        ),
      ],
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'src/entities/Article/testing/file.tsx\'',
      errors: [
        makeErrorWithSuggestion(
          'testing/file.tsx',
          'import { addCommentFormActions, addCommentFormReducer } from \'src/entities/Article\'',
          'src/entities/Article',
        ),
      ],
    },
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'src/entities/Article/model/file.ts\'',
      errors: [
        makeErrorWithSuggestion(
          'model/file.ts',
          'import { addCommentFormActions, addCommentFormReducer } from \'src/entities/Article\'',
          'src/entities/Article'
        ),
      ],
    },
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'some/root/path/entities/Article/model/file.ts\'',
      errors: [
        makeErrorWithSuggestion(
          'model/file.ts',
          'import { addCommentFormActions, addCommentFormReducer } from \'some/root/path/entities/Article\'',
          'some/root/path/entities/Article'
        ),
      ],
    },
  ],
});
