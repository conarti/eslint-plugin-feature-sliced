const rule = require('./index');
const { RuleTester } = require('eslint');
const { MESSAGE_ID } = require('./constants');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  parser: require.resolve('@typescript-eslint/parser'),
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
        valueToRemove: suggestionSegments,
      },
      output: suggestionOutput,
    },
  ],
});

/**
 * TODO добавить проверки на импорты файлов не зарезервированных как сегменты fsd.
 * Например (невалидный тест):
 *     {
 *       code: "import { Bar } from '@/features/group-folder/sub-group-folder/sub-sub-group/bar/test.js';",
 *       filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
 *       errors: [
 *         makeErrorWithSuggestion(
 *           'test.js',
 *           "import { Bar } from '@/features/group-folder/sub-group-folder/sub-sub-group/bar';",
 *           '@/features/group-folder/sub-group-folder/sub-sub-group/bar',
 *         ),
 *       ],
 *     },
*/

ruleTester.run('public-api', rule, {
  valid: [
    {
      /* should work with slice public api */
      code: "import { addCommentFormActions, addCommentFormReducer } from 'src/entities/Article'",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.vue',
    },
    {
      /* should work with slice public api and alias in path */
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.vue',
    },
    {
      /* should work with long paths */
      code: "import { addCommentFormActions, addCommentFormReducer } from 'some/root/path/entities/Article'",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.vue',
    },
    {
      /* should not validate public api relative paths in 'app' */
      code: "import { setStylesForTheme } from 'app/providers/ThemeProvider'",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.vue',
    },
    {
      /* it should work with fsd segments */
      code: "import { formConfig } from 'src/features/form/config'",
      filename: 'src/features/form/ui/index.js',
    },
    {
      /* it should work with fsd segments with file extension */
      code: "import { formConfig } from 'src/features/form/config.ts'",
      filename: 'src/features/form/ui/index.js',
    },
    {
      /* it should work with fsd segments with relative path style */
      code: "import { formConfig } from '../config'",
      filename: 'src/features/form/ui/index.js',
    },
    {
      /* should not validate public api paths in 'shared' and fsd methodology segments (assets/api/model/lib/ui/config) */
      code: "import { ThemeSwitcher } from 'shared/ui/ThemeSwitcher';",
      filename: 'src/features/form/ui/index.js',
    },
    {
      /* should not validate public api paths in 'shared' and fsd methodology segments (assets/api/model/lib/ui/config) */
      code: "import { foo } from 'shared/lib/foo';",
      filename: 'src/features/form/ui/index.js',
    },
    {
      /* should work with group folders */
      code: "import { Bar } from '@/features/group-folder/bar';",
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
    },
    {
      /* should work with subgroup folders */
      code: "import { Bar } from '@/features/group-folder/sub-group-folder/sub-sub-group/bar';",
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
    },
    {
      /* should not validate public api relative paths in 'shared' */
      code: "import { Bar } from '../../../constants/bar';",
      filename: '/Users/test-user/repository/src/shared/ui/foo/index.vue',
    },
    {
      /* should only swear at fsd methodology segments (assets/api/model/lib/ui/config) */
      code: "import { useFoo } from '../foo/use-foo';",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.vue',
    },
    {
      /* should not validate imports inside segment */
      code: "import { Foo } from './types';",
      filename: '/Users/test-user/repository/src/features/foo/model/index.ts',
    },
    {
      /* should understand 'index' files with extensions */
      code: "import { FooComponent } from './ui/index.ts';",
      filename: '/Users/test-user/repository/src/features/foo/index.ts',
    },
    {
      /* should understand 'index' files with different extensions */
      code: "import FooComponent from './ui/index.vue';",
      filename: '/Users/test-user/repository/src/features/foo/index.ts',
    },
    {
      /* should understand 'index' files with extensions and different layers */
      code: "import { Bar } from 'src/entities/bar/index.ts';",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.ts',
    },
    {
      /* should understand 'index' files without extensions and with different layers */
      code: "import { Bar } from 'src/entities/bar/index';",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.ts',
    },
    {
      /* should correct read slices from paths */
      code: "import { Foo } from '../models';",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.ts',
    },
    {
      /* allow imports inside segment with no extra sub dirs */
      filename: 'src/features/foo/ui/bar.tsx',
      code: "import { Foo } from './foo.tsx';",
    },
    {
      /* allow imports inside segment with extra sub dirs */
      filename: 'src/features/foo/ui/bar/index.tsx',
      code: "import { Foo } from '../foo.tsx';",
    },
    {
      /* allow imports inside segment with extra sub dirs and 'segment-like' file names */
      filename: 'src/features/foo/ui/bar/ui.tsx',
      code: "import { Foo } from '../foo.tsx';",
    },
  ],

  invalid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/file.ts'",
      errors: [
        makeErrorWithSuggestion(
          'model/file.ts',
          "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article'",
          'entities/Article',
        ),
      ],
    },
    /* should work with import expressions */
    {
      code: "const foo = () => import('entities/Article/model/file.ts')",
      errors: [
        makeErrorWithSuggestion(
          'model/file.ts',
          "const foo = () => import('entities/Article')",
          'entities/Article',
        ),
      ],
    },
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/file.ts'",
      errors: [
        makeErrorWithSuggestion(
          'model/file.ts',
          "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
          '@/entities/Article',
        ),
      ],
    },
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from 'src/entities/Article/model/file.ts'",
      errors: [
        makeErrorWithSuggestion(
          'model/file.ts',
          "import { addCommentFormActions, addCommentFormReducer } from 'src/entities/Article'",
          'src/entities/Article',
        ),
      ],
    },
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from 'some/root/path/entities/Article/model/file.ts'",
      errors: [
        makeErrorWithSuggestion(
          'model/file.ts',
          "import { addCommentFormActions, addCommentFormReducer } from 'some/root/path/entities/Article'",
          'some/root/path/entities/Article',
        ),
      ],
    },
    {
      code: "import PassportIssuanceSearchRegistryParams from '@/entities/passport-issuance/ui/search-registry-params.vue';",
      errors: [
        makeErrorWithSuggestion(
          'ui/search-registry-params.vue',
          "import PassportIssuanceSearchRegistryParams from '@/entities/passport-issuance';",
          '@/entities/passport-issuance',
        ),
      ],
    },
    // shouldn't validate "ui", "model", "lib", "api", "config", "assets" as group folders
    {
      code: "import { Bar } from '@/features/bar/ui';",
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
      errors: [
        makeErrorWithSuggestion(
          'ui',
          "import { Bar } from '@/features/bar';",
          '@/features/bar',
        ),
      ],
    },
    {
      code: "import { Bar } from '@/features/bar/model';",
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
      errors: [
        makeErrorWithSuggestion(
          'model',
          "import { Bar } from '@/features/bar';",
          '@/features/bar',
        ),
      ],
    },
    {
      code: "import { Bar } from '@/features/bar/lib';",
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
      errors: [
        makeErrorWithSuggestion(
          'lib',
          "import { Bar } from '@/features/bar';",
          '@/features/bar',
        ),
      ],
    },
    {
      code: "import { Bar } from '@/features/bar/api';",
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
      errors: [
        makeErrorWithSuggestion(
          'api',
          "import { Bar } from '@/features/bar';",
          '@/features/bar',
        ),
      ],
    },
    {
      code: "import { Bar } from '@/features/bar/config';",
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
      errors: [
        makeErrorWithSuggestion(
          'config',
          "import { Bar } from '@/features/bar';",
          '@/features/bar',
        ),
      ],
    },
    {
      code: "import { Bar } from '@/features/bar/assets';",
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
      errors: [
        makeErrorWithSuggestion(
          'assets',
          "import { Bar } from '@/features/bar';",
          '@/features/bar',
        ),
      ],
    },
    {
      code: "import { Bar } from '@/features/group-folder/sub-group-folder/sub-sub-group/bar/assets';",
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
      errors: [
        makeErrorWithSuggestion(
          'assets',
          "import { Bar } from '@/features/group-folder/sub-group-folder/sub-sub-group/bar';",
          '@/features/group-folder/sub-group-folder/sub-sub-group/bar',
        ),
      ],
    },
    {
      code: "import { useFoo } from '../model/use-foo';",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.vue',
      errors: [
        makeErrorWithSuggestion(
          'use-foo',
          "import { useFoo } from '../model';",
          '../model',
        ),
      ],
    },
    {
      code: "import { useFoo } from '../model/use-foo.js';",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.vue',
      errors: [
        makeErrorWithSuggestion(
          'use-foo.js',
          "import { useFoo } from '../model';",
          '../model',
        ),
      ],
    },
  ],
});
