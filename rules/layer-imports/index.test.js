const { RuleTester } = require('eslint');
const rule = require('./index');
const { ERROR_MESSAGE_ID } = require('./constants');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  parser: require.resolve('@typescript-eslint/parser'),
});

const allowTypeImportsOptions = [
  {
    allowTypeImports: true
  },
]

const makeIgnoreOptions = (patterns) => [
  {
    ignorePatterns: patterns,
  }
]

ruleTester.run('layer-imports', rule, {
  valid: [
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\features\\Article',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/shared/Button.tsx\'',
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\features\\Article',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article\'',
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\app\\providers',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/widgets/Articl\'',
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\widgets\\pages',
      code: 'import { useLocation } from \'react-router-dom\'',
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\app\\providers',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'redux\'',
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\index.tsx',
      code: 'import { StoreProvider } from \'@/app/providers/StoreProvider\';',
    },
    {
      filename: 'src/shared/ui/foo',
      code: 'import { Baz } from \'shared/bar\';',
    },
    {
      filename: 'src/app/App.tsx',
      code: 'import { AppRouter } from \'app/providers/router\';',
    },
    {
      filename: 'src/entities/bar',
      code: 'import type { Baz } from \'entities/baz\';',
      options: allowTypeImportsOptions,
    },
    {
      filename: 'src/shared/ui/foo',
      code: 'import type { Bar } from \'@/entities/bar\';',
      options: allowTypeImportsOptions,
    },
    {
      filename: 'src/shared/ui/foo',
      code: 'import { Bar } from \'@/entities/bar\';',
      options: makeIgnoreOptions(['@/entities/bar']),
    },
    {
      filename: 'src/shared/ui/foo',
      code: 'import { Bar } from \'@/entities/bar\';',
      options: makeIgnoreOptions(['**/bar']),
    },
  ],

  invalid: [
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\providers',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/features/Articl\'',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
        },
      ],
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\features\\providers',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/widgets/Articl\'',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
        },
      ],
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\providers',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/widgets/Articl\'',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
        },
      ],
    },
    {
      filename: 'src/shared/ui/foo',
      code: 'import { StoreProvider } from \'@/entities/bar\';',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
        },
      ],
    },
    {
      filename: 'src/shared/ui/foo',
      code: 'import { StoreProvider } from \'app/bar\';',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
        },
      ],
    },
    {
      filename: 'src/shared/ui/foo',
      code: 'import { StoreProvider } from \'src/app/bar\';',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
        },
      ],
    },
    {
      filename: 'src/entities/bar',
      code: 'import { Baz } from \'entities/baz\';',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
        },
      ],
    },
  ],
});
