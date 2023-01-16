const rule = require('./index');
const { RuleTester } = require('eslint');
const { errorCodes } = require('../../lib/constants');

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

const aliasOptions = [
  {
    alias: '@',
  },
];

ruleTester.run('public-api-imports', rule, {
  valid: [
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'../../model/slices/addCommentFormSlice\'',
      errors: [],
    },
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article\'',
      errors: [],
      options: aliasOptions,
    },
    {
      code: 'import { setStylesForTheme } from \'app/providers/ThemeProvider\'',
      errors: [],
    },
  ],

  invalid: [
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'entities/Article/model/file.ts\'',
      errors: [
        {
          messageId: errorCodes['public-api-imports'],
        },
      ],
      output: 'import { addCommentFormActions, addCommentFormReducer } from \'entities/Article\'',
    },
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article/model/file.ts\'',
      errors: [
        {
          messageId: errorCodes['public-api-imports'],
        },
      ],
      output: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article\'',
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article/testing/file.tsx\'',
      errors: [
        {
          messageId: errorCodes['public-api-imports'],
        },
      ],
      output: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article\'',
      options: aliasOptions,
    },
  ],
});
