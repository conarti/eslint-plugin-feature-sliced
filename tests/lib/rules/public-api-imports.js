/**
 * @fileoverview Check for module imports from public api
 * @author conarti
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/public-api-imports'),
  RuleTester = require('eslint').RuleTester;
const { errorCodes } = require('../../../lib/constants');


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

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
