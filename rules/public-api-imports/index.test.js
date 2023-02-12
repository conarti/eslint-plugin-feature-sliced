const rule = require('./index');
const { RuleTester } = require('eslint');
const { ERROR_MESSAGE_ID } = require('./constants');

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
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
  ],

  invalid: [
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'entities/Article/model/file.ts\'',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.SHOULD_BE_FROM_PUBLIC_API,
        },
      ],
      output: 'import { addCommentFormActions, addCommentFormReducer } from \'entities/Article\'',
    },
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article/model/file.ts\'',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.SHOULD_BE_FROM_PUBLIC_API,
        },
      ],
      output: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article\'',
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article/testing/file.tsx\'',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.SHOULD_BE_FROM_PUBLIC_API,
        },
      ],
      output: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article\'',
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'src/entities/Article/testing/file.tsx\'',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.SHOULD_BE_FROM_PUBLIC_API,
        },
      ],
      output: 'import { addCommentFormActions, addCommentFormReducer } from \'src/entities/Article\'',
    },
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'src/entities/Article/model/file.ts\'',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.SHOULD_BE_FROM_PUBLIC_API,
        },
      ],
      output: 'import { addCommentFormActions, addCommentFormReducer } from \'src/entities/Article\'',
    },
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'some/root/path/entities/Article/model/file.ts\'',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.SHOULD_BE_FROM_PUBLIC_API,
        },
      ],
      output: 'import { addCommentFormActions, addCommentFormReducer } from \'some/root/path/entities/Article\'',
    },
  ],
});
