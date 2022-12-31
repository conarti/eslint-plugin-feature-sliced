/**
 * @fileoverview Checks layer imports
 * @author conarti
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/layer-imports'),
  RuleTester = require('eslint').RuleTester;
const { errorMessages } = require('../../../lib/constants');


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const aliasOptions = [
  {
    alias: '@',
  },
];
const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});
ruleTester.run('layer-imports', rule, {
  valid: [
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\features\\Article',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/shared/Button.tsx\'',
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\features\\Article',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article\'',
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\app\\providers',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/widgets/Articl\'',
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\widgets\\pages',
      code: 'import { useLocation } from \'react-router-dom\'',
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\app\\providers',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'redux\'',
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\index.tsx',
      code: 'import { StoreProvider } from \'@/app/providers/StoreProvider\';',
      errors: [],
      options: aliasOptions,
    },
  ],

  invalid: [
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\providers',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/features/Articl\'',
      errors: [{ message: errorMessages['layer-imports'] }],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\features\\providers',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/widgets/Articl\'',
      errors: [{ message: errorMessages['layer-imports'] }],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\providers',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/widgets/Articl\'',
      errors: [{ message: errorMessages['layer-imports'] }],
      options: aliasOptions,
    },
  ],
});
