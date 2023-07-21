import { type TSESLint } from '@typescript-eslint/utils';
import { RuleTester } from '../../../tests/rule-tester';
import { type Layer } from '../../config';
import {
  ERROR_MESSAGE_ID,
  type MessageIds,
  type Options,
} from './config';
import rule from './index';

const CWD_MOCK_PATH = '/Users/user/projects/project/app';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  parser: require.resolve('@typescript-eslint/parser'),
  cwd: CWD_MOCK_PATH,
});

const makeFilename = (filename: string): string => `${CWD_MOCK_PATH}/${filename}`;

const allowTypeImportsOptions: Options = [
  {
    allowTypeImports: true,
  },
] as Options;

const makeIgnoreOptions = (patterns: string[]): Options => [
  {
    ignorePatterns: patterns,
  },
] as Options;

const makeIgnoreInFilesOptions = (patterns: string[]): Options => [
  {
    ignoreInFilesPatterns: patterns,
  },
] as Options;

function makeErrorMessage(importLayer: Layer, currentFileLayer: Layer): TSESLint.TestCaseError<MessageIds> {
  return {
    messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
    data: {
      importLayer,
      currentFileLayer,
    },
  };
}

type ErrorPosition = {
  column: number;
  endColumn: number;
  line: number;
  endLine: number;
}

function makeErrorMessageAtSpecifier(importLayer: Layer, currentFileLayer: Layer, position: ErrorPosition): TSESLint.TestCaseError<MessageIds> {
  return {
    messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
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

// TODO refactor tests

ruleTester.run('layers-slices', rule, {
  valid: [
    {
      name: 'should valid if import from "shared" to "features"',
      filename: 'src/features/bar/ui.tsx',
      code: "import { foo } from '@/shared/foo.tsx'",
    },
    {
      name: 'should valid if import from "entities" to "features"',
      filename: 'src/features/bar/ui.tsx',
      code: "import { foo } from '@/entities/foo.tsx'",
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\app\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\widgets\\pages',
      code: "import { useLocation } from 'react-router-dom'",
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\app\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'redux'",
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\index.tsx',
      code: "import { StoreProvider } from '@/app/providers/StoreProvider';",
    },
    {
      filename: 'src/shared/ui/foo',
      code: "import { Baz } from 'shared/bar';",
    },
    {
      filename: 'src/app/App.tsx',
      code: "import { AppRouter } from 'app/providers/router';",
    },
    {
      name: 'should allow "import type" with enabled option (separate import type style and same layer)',
      filename: 'src/entities/bar',
      code: "import type { Baz } from 'entities/baz';",
      options: allowTypeImportsOptions,
    },
    {
      name: 'should allow "import type" with enabled option (separate import type style and to layer below)',
      filename: 'src/shared/ui/foo',
      code: "import type { Bar } from '@/entities/bar';",
      options: allowTypeImportsOptions,
    },
    {
      name: 'should allow "import type" with enabled option (inline import type style and to layer below)',
      filename: 'src/shared/ui/foo',
      code: "import { type Bar } from '@/entities/bar';",
      options: allowTypeImportsOptions,
    },
    {
      name: 'should allow type imports by default',
      filename: 'src/shared/utils/index.ts',
      code: "import type { Foo } from '@/widgets/foo';",
    },
    {
      filename: 'src/shared/ui/foo',
      code: "import { Bar } from '@/entities/bar';",
      options: makeIgnoreOptions(['@/entities/bar']),
    },
    {
      filename: 'src/shared/ui/foo',
      code: "import { Bar } from '@/entities/bar';",
      options: makeIgnoreOptions(['**/bar']),
    },
    {
      filename: 'src/entities/bar/ui',
      code: "import { Bar } from '@/entities/bar/model';",
    },
    {
      filename: 'src/shared/ui/foo/index.ts',
      code: "import { useBar } from '../../../hooks/useBar.ts';",
    },
    {
      filename: 'src/shared/ui/foo/index.test.ts',
      code: "import { Foo } from './index.ts';",
    },
    {
      filename: 'src/shared/ui/foo/index.test.ts',
      code: "import { Foo } from '.';",
    },
    {
      filename: 'src/pages/foo-bar/lib/index.ts',
      code: "import generatePayloadMapper from './generatePayloadMapper';",
    },
    {
      name: "import inside 'app' layer",
      filename: 'src/app/foo/index.ts',
      code: "import { Bar } from '../bar';",
    },
    {
      name: "has 'layer' name at not layer path part",
      filename: 'src/features/foo/index.ts',
      code: "import { Bar } from 'src/entities/app-bar';",
    },
    {
      /* TODO: should works without ignore options? This is the scope of the 'public-api' rule */
      name: 'import to layer public api, but only with ignore options',
      filename: '/Users/test/Projects/frontend/src/features/index.ts',
      code: "import { Bar } from 'src/features/bar';",
      options: makeIgnoreInFilesOptions(['**/src/(shared|entities|features|widgets|pages|processes|app)/index.ts']),
    },
    {
      name: 'should be valid if import from same slice and slice contain "layer" name',
      filename: makeFilename('src/features/foo-pages/ui/foo.vue'),
      code: "import { foo } from '../model'",
    },
  ],

  invalid: [
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/features/Articl'",
      errors: [makeErrorMessage('features', 'entities')],
    },
    {
      name: 'should work with import expressions',
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\providers',
      code: "const foo = () => import('@/features/Articl')",
      errors: [makeErrorMessage('features', 'entities')],
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\features\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
      errors: [makeErrorMessage('widgets', 'features')],
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
      errors: [makeErrorMessage('widgets', 'entities')],
    },
    {
      name: 'should be invalid if import "entities" to "shared" (to layer without slices)',
      filename: 'src/shared/ui/foo',
      code: "import { StoreProvider } from '@/entities/bar';",
      errors: [makeErrorMessage('entities', 'shared')],
    },
    {
      name: 'should be invalid if import "app" to "shared" (layers without slices)',
      filename: 'src/shared/ui/foo',
      code: "import { StoreProvider } from 'app/bar';",
      errors: [makeErrorMessage('app', 'shared')],
    },
    {
      filename: 'src/entities/bar',
      code: "import { Baz } from 'entities/baz';",
      errors: [makeErrorMessage('entities', 'entities')],
    },
    {
      filename: 'src/entities/article/model/services.ts',
      code: "import { userModel } from '../../user';",
      errors: [makeErrorMessage('entities', 'entities')],
    },
    {
      filename: 'src/entities/foo/model.ts',
      code: "import { bar } from '../../../features/bar';",
      errors: [makeErrorMessage('features', 'entities')],
    },
    {
      filename: 'src/entities/foo/model.ts',
      code: "import { bar } from '../../../features';",
      errors: [makeErrorMessage('features', 'entities')],
    },
    {
      filename: '/Users/conarti/Projects/feature-sliced-frontend/src/entities/foo-bar-baz/ui/index.vue',
      code: "import { FooBar } from '../../foo-bar/ui/index.vue';",
      errors: [makeErrorMessage('entities', 'entities')],
    },
    {
      name: 'if there are layer names in the path',
      filename: `${CWD_MOCK_PATH}/src/entities/Viewer/model/types.ts`,
      code: "import { u } from '@/entities/User';",
      errors: [makeErrorMessage('entities', 'entities')],
    },
    {
      /* TODO: should this be valid? This is the scope of the 'public-api' rule */
      name: 'import to layer public api',
      filename: '/Users/test/Projects/frontend/src/features/index.ts',
      code: "import { Bar } from 'src/features/bar';",
      errors: [makeErrorMessage('features', 'features')],
    },
    {
      name: 'should allow "import type" with enabled option, but throw errors for value imports',
      filename: 'src/shared/ui/foo',
      code: "import { type Bar, bar } from '@/entities/bar';",
      options: allowTypeImportsOptions,
      errors: [makeErrorMessage('entities', 'shared')],
    },
    {
      name: 'should throw error for every specifier at correct positions and should not for valid specifiers',
      filename: 'src/shared/ui/foo',
      code: `import { bar, type Bar, 
        baz, 
        type Boz,
        boz,
      } from '@/entities/bar';`,
      options: allowTypeImportsOptions,
      errors: [
        makeErrorMessageAtSpecifier(
          'entities',
          'shared',
          { // "bar"
            line: 1,
            endLine: 1,
            column: 10,
            endColumn: 13,
          },
        ),
        makeErrorMessageAtSpecifier(
          'entities',
          'shared',
          { // "baz"
            line: 2,
            endLine: 2,
            column: 9,
            endColumn: 12,
          },
        ),
        makeErrorMessageAtSpecifier(
          'entities',
          'shared',
          { // "boz"
            line: 4,
            endLine: 4,
            column: 9,
            endColumn: 12,
          },
        ),
      ],
    },
    {
      name: 'should throw only one error if it has multiple specifiers',
      filename: 'src/shared/ui/foo',
      code: "import { bar, baz, boz, type Bar } from '@/entities/bar';",
      options: [
        {
          allowTypeImports: false,
        },
      ] as Options,
      errors: [makeErrorMessage('entities', 'shared')],
    },
  ],
});
