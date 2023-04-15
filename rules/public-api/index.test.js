const rule = require('./index');
const { RuleTester } = require('eslint');
const { MESSAGE_ID } = require('./constants');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
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

ruleTester.run('public-api', rule, {
  valid: [
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'../../model/slices/addCommentFormSlice\'',
    },
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'@/entities/Article\'',
    },
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'src/entities/Article\'',
    },
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'some/root/path/entities/Article\'',
    },
    {
      code: 'import { setStylesForTheme } from \'app/providers/ThemeProvider\'',
    },
    {
      code: 'import { formConfig } from \'src/features/form/config\'',
      filename: 'src/features/form/ui/index.js',
    },
    {
      code: 'import { ThemeSwitcher } from \'shared/ui/ThemeSwitcher\';',
      filename: 'src/features/form/ui/index.js',
    },
    {
      code: 'import { foo } from \'shared/lib/foo\';',
      filename: 'src/features/form/ui/index.js',
    },
    {
      code: 'import { Bar } from \'@/features/group-folder/bar\';',
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
    },
    {
      code: 'import { Bar } from \'@/features/group-folder/sub-group-folder/sub-sub-group/bar\';',
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
    },
    {
      // should not validate public api relative paths
      code: "import { Bar } from '../../../constants/bar';",
      filename: '/Users/test-user/repository/src/shared/ui/foo/index.vue',
    },
    {
      // should only swear at fsd methodology slices (assets/api/model/lib/ui)
      code: "import { useFoo } from '../foo/use-foo';",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.vue',
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
          '@/entities/Article',
        ),
      ],
    },
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'src/entities/Article/model/file.ts\'',
      errors: [
        makeErrorWithSuggestion(
          'model/file.ts',
          'import { addCommentFormActions, addCommentFormReducer } from \'src/entities/Article\'',
          'src/entities/Article',
        ),
      ],
    },
    {
      code: 'import { addCommentFormActions, addCommentFormReducer } from \'some/root/path/entities/Article/model/file.ts\'',
      errors: [
        makeErrorWithSuggestion(
          'model/file.ts',
          'import { addCommentFormActions, addCommentFormReducer } from \'some/root/path/entities/Article\'',
          'some/root/path/entities/Article',
        ),
      ],
    },
    {
      code: 'import PassportIssuanceSearchRegistryParams from \'@/entities/passport-issuance/ui/search-registry-params.vue\';',
      errors: [
        makeErrorWithSuggestion(
          'ui/search-registry-params.vue',
          'import PassportIssuanceSearchRegistryParams from \'@/entities/passport-issuance\';',
          '@/entities/passport-issuance',
        ),
      ],
    },
    // shouldn't validate "ui", "model", "lib", "api", "config", "assets" as group folders
    {
      code: 'import { Bar } from \'@/features/bar/ui\';',
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
      errors: [
        makeErrorWithSuggestion(
          'ui',
          'import { Bar } from \'@/features/bar\';',
          '@/features/bar',
        ),
      ],
    },
    {
      code: 'import { Bar } from \'@/features/bar/model\';',
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
      errors: [
        makeErrorWithSuggestion(
          'model',
          'import { Bar } from \'@/features/bar\';',
          '@/features/bar',
        ),
      ],
    },
    {
      code: 'import { Bar } from \'@/features/bar/lib\';',
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
      errors: [
        makeErrorWithSuggestion(
          'lib',
          'import { Bar } from \'@/features/bar\';',
          '@/features/bar',
        ),
      ],
    },
    {
      code: 'import { Bar } from \'@/features/bar/api\';',
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
      errors: [
        makeErrorWithSuggestion(
          'api',
          'import { Bar } from \'@/features/bar\';',
          '@/features/bar',
        ),
      ],
    },
    {
      code: 'import { Bar } from \'@/features/bar/config\';',
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
      errors: [
        makeErrorWithSuggestion(
          'config',
          'import { Bar } from \'@/features/bar\';',
          '@/features/bar',
        ),
      ],
    },
    {
      code: 'import { Bar } from \'@/features/bar/assets\';',
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
      errors: [
        makeErrorWithSuggestion(
          'assets',
          'import { Bar } from \'@/features/bar\';',
          '@/features/bar',
        ),
      ],
    },
    {
      code: 'import { Bar } from \'@/features/group-folder/sub-group-folder/sub-sub-group/bar/assets\';',
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
      errors: [
        makeErrorWithSuggestion(
          'assets',
          'import { Bar } from \'@/features/group-folder/sub-group-folder/sub-sub-group/bar\';',
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
  ],
});
