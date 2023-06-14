import { ESLintUtils } from '@typescript-eslint/utils';
import rule from './index';
import { ERROR_MESSAGE_ID } from './config';

const ruleTester = new ESLintUtils.RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  parser: '@typescript-eslint/parser',
});

const allowTypeImportsOptions: [{ allowTypeImports: boolean }] = [
  {
    allowTypeImports: true,
  },
];

const makeIgnoreOptions = (patterns: string[]): [{ ignorePatterns: string[] }] => [
  {
    ignorePatterns: patterns,
  },
];

const makeErrorMessage = (importLayer: string, currentFileLayer: string) => ({
  messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
  data: {
    importLayer,
    currentFileLayer,
  },
});

// TODO: ретроспектировать тесты

ruleTester.run('layers-slices', rule, {
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
    {
      filename: 'src/entities/bar/ui',
      code: 'import { Bar } from \'@/entities/bar/model\';',
    },
    {
      filename: 'src/shared/ui/foo/index.ts',
      code: 'import { useBar } from \'../../../hooks/useBar.ts\';',
    },
    {
      filename: 'src/shared/ui/foo/index.test.ts',
      code: 'import { Foo } from \'./index.ts\';',
    },
    {
      filename: 'src/shared/ui/foo/index.test.ts',
      code: 'import { Foo } from \'.\';',
    },
    {
      filename: 'src/pages/foo-bar/lib/index.ts',
      code: 'import generatePayloadMapper from \'./generatePayloadMapper\';',
    },
    {
      name: "import inside 'app' layer",
      filename: 'src/app/foo/index.ts',
      code: 'import { Bar } from \'../bar\';',
    },
    {
      name: "has 'layer' name at not layer path part",
      filename: 'src/features/foo/index.ts',
      code: 'import { Bar } from \'src/entities/app-bar\';',
    },
  ],

  invalid: [
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\providers',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/features/Articl\'',
      errors: [makeErrorMessage('features', 'entities')],
    },
    {
      name: 'should work with import expressions',
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\providers',
      code: 'const foo = () => import(\'@/features/Articl\')',
      errors: [makeErrorMessage('features', 'entities')],
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\features\\providers',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/widgets/Articl\'',
      errors: [makeErrorMessage('widgets', 'features')],
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\providers',
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/widgets/Articl\'',
      errors: [makeErrorMessage('widgets', 'entities')],
    },
    {
      filename: 'src/shared/ui/foo',
      code: 'import { StoreProvider } from \'@/entities/bar\';',
      errors: [makeErrorMessage('entities', 'shared')],
    },
    {
      filename: 'src/shared/ui/foo',
      code: 'import { StoreProvider } from \'app/bar\';',
      errors: [makeErrorMessage('app', 'shared')],
    },
    {
      filename: 'src/shared/ui/foo',
      code: 'import { StoreProvider } from \'src/app/bar\';',
      errors: [makeErrorMessage('app', 'shared')],
    },
    {
      filename: 'src/entities/bar',
      code: 'import { Baz } from \'entities/baz\';',
      errors: [makeErrorMessage('entities', 'entities')],
    },
    {
      filename: 'src/entities/article/model/services.ts',
      code: 'import { userModel } from \'../../user\';',
      errors: [makeErrorMessage('entities', 'entities')],
    },
    {
      filename: 'src/entities/foo/model.ts',
      code: 'import { bar } from \'../../../features/bar\';',
      errors: [makeErrorMessage('features', 'entities')],
    },
    {
      filename: 'src/entities/foo/model.ts',
      code: 'import { bar } from \'../../../features\';',
      errors: [makeErrorMessage('features', 'entities')],
    },
    {
      filename: '/Users/conarti/Projects/feature-sliced-frontend/src/entities/foo-bar-baz/ui/index.vue',
      code: 'import { FooBar } from \'../../foo-bar/ui/index.vue\';',
      errors: [makeErrorMessage('entities', 'entities')],
    },
    {
      name: 'if there are layer names in the path',
      filename: '/Users/user/Documents/Files/projects/project/app/src/entities/Viewer/model/types.ts',
      code: "import { u } from '@/entities/User';",
      errors: [makeErrorMessage('entities', 'entities')],
    },
  ],
});
