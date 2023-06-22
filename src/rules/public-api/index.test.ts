import { type Rule } from 'eslint';
import { RuleTester } from '../../../tests/rule-tester';
import {
  layers,
  layersWithoutSlices,
} from '../../config';
import {
  MESSAGE_ID,
  VALIDATION_LEVEL,
  type Options,
} from './config';
import rule from './index';

const FSD_LAYERS = layers;
const FSD_LAYERS_WITHOUT_SLICES = layersWithoutSlices;

const CWD_MOCK_PATH = '\\Users\\User\\Projects\\app'; /* windows path because we need also normalize it to unix like others */

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  parser: require.resolve('@typescript-eslint/parser'),
}, CWD_MOCK_PATH);

const makeErrorWithSuggestion = (suggestionSegments: string, suggestionOutput: string, fixedPath: string) => ({
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

const errorLayersPublicApiNotAllowed = {
  messageId: MESSAGE_ID.LAYERS_PUBLIC_API_NOT_ALLOWED,
};

/* const errorFromInvalidStructure = {
  messageId: MESSAGE_ID.FROM_INVALID_STRUCTURE,
}; */

const setValidationLevel = (level: VALIDATION_LEVEL): [{ level: VALIDATION_LEVEL }] => [
  {
    level,
  },
];

const makeIgnoreInFilesOptions = (patterns: string[]) => [
  {
    ignoreInFilesPatterns: patterns,
  },
] as Options;

const shouldNotValidateLayersWithoutSlices: Parameters<typeof ruleTester.run>[2]['valid'] = FSD_LAYERS_WITHOUT_SLICES.map((layer) => ({
  name: `should not validate public api with layers that can not contain slices ("${layer}")`,
  filename: 'src/features/foo/index.ts',
  code: `import { baz } from "src/${layer}/foo/ui.ts";`,
}));

ruleTester.run('public-api', rule as unknown as Rule.RuleModule, {
  valid: [
    ...shouldNotValidateLayersWithoutSlices,
    {
      name: 'should work with slice public api',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'src/entities/Article'",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.vue',
    },
    {
      name: 'should work with slice public api and alias in path',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.vue',
    },
    {
      name: 'should work with long paths',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'some/root/path/entities/Article'",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.vue',
    },
    {
      name: "should not validate public api relative paths in 'app'",
      code: "import { setStylesForTheme } from 'app/providers/ThemeProvider'",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.vue',
    },
    {
      name: 'it should work with fsd segments',
      code: "import { formConfig } from 'src/features/form/config'",
      filename: 'src/features/form/ui/index.js',
    },
    {
      name: 'it should work with fsd segments with file extension',
      code: "import { formConfig } from 'src/features/form/config.ts'",
      filename: 'src/features/form/ui/index.js',
    },
    {
      name: 'it should work with fsd segments with relative path style',
      code: "import { formConfig } from '../config'",
      filename: 'src/features/form/ui/index.js',
    },
    {
      name: "should not validate public api paths in 'shared' and fsd methodology segments (assets/api/model/lib/ui/config)",
      code: "import { ThemeSwitcher } from 'shared/ui/ThemeSwitcher';",
      filename: 'src/features/form/ui/index.js',
    },
    {
      name: "should not validate public api paths in 'shared' and fsd methodology segments (assets/api/model/lib/ui/config)",
      code: "import { foo } from 'shared/lib/foo';",
      filename: 'src/features/form/ui/index.js',
    },
    {
      name: 'should work with group folders',
      code: "import { Bar } from '@/features/group-folder/bar';",
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
    },
    {
      name: 'should work with subgroup folders',
      code: "import { Bar } from '@/features/group-folder/sub-group-folder/sub-sub-group/bar';",
      filename: '/Users/conarti/Projects/foo-frontend/src/pages/home/ui/index.vue',
    },
    {
      name: "should not validate public api relative paths in 'shared'",
      code: "import { Bar } from '../../../constants/bar';",
      filename: '/Users/test-user/repository/src/shared/ui/foo/index.vue',
    },
    {
      name: 'should only swear at fsd methodology segments (assets/api/model/lib/ui/config)',
      code: "import { useFoo } from '../foo/use-foo';",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.vue',
    },
    {
      name: 'should not validate imports inside segment',
      code: "import { Foo } from './types';",
      filename: '/Users/test-user/repository/src/features/foo/model/index.ts',
    },
    {
      name: "should understand 'index' files with extensions",
      code: "import { FooComponent } from './ui/index.ts';",
      filename: '/Users/test-user/repository/src/features/foo/index.ts',
    },
    {
      name: "should understand 'index' files with different extensions",
      code: "import FooComponent from './ui/index.vue';",
      filename: '/Users/test-user/repository/src/features/foo/index.ts',
    },
    {
      name: "should understand 'index' files with extensions and different layers",
      code: "import { Bar } from 'src/entities/bar/index.ts';",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.ts',
    },
    {
      name: "should understand 'index' files without extensions and with different layers",
      code: "import { Bar } from 'src/entities/bar/index';",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.ts',
    },
    {
      name: 'should correct read slices from paths',
      code: "import { Foo } from '../models';",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.ts',
    },
    {
      name: 'allow imports inside segment with no extra sub dirs',
      filename: 'src/features/foo/ui/bar.tsx',
      code: "import { Foo } from './foo.tsx';",
    },
    {
      name: 'allow imports inside segment with extra sub dirs',
      filename: 'src/features/foo/ui/bar/index.tsx',
      code: "import { Foo } from '../foo.tsx';",
    },
    {
      name: "allow imports inside segment with extra sub dirs and 'segment-like' file names",
      filename: 'src/features/foo/ui/bar/ui.tsx',
      code: "import { Foo } from '../foo.tsx';",
    },
    {
      filename: '/Users/macbook/Projects/the-rooms/src/entities/room/lib/index.ts',
      code: "export { useRoom } from './useRoom';",
    },
    {
      filename: '/Users/macbook/Projects/the-rooms/src/entities/room/lib/index.ts',
      code: "export * from './useRoom';",
    },
    {
      name: "should not throw TypeError for 'export const'",
      filename: '',
      code: 'export const foo = () => () => {};',
    },
    {
      name: 'should allow segments without index files by default',
      filename: 'src/features/foo/index.ts',
      code: 'import { bar } from "./ui/bar";',
    },
    {
      name: 'should work ignoreInFilesPatterns option',
      filename: 'src/features/index.ts',
      code: 'import { bar } from "./ui/bar";',
      options: makeIgnoreInFilesOptions([`**/(${FSD_LAYERS.join('|')})/index.*`]),
    },
    {
      name: 'should work with multiple layer names in path (correct understand layer)',
      filename: '/Users/User/Projects/frontend/src/processes/shared/index.js',
      code: "import { foo } from 'shared/foo';",
    },
    {
      name: 'should work with multiple layer names in path (correct understand layer using "cwd")',
      filename: '/Users/User/Projects/app/index.js',
      code: "import { foo } from 'shared/foo';",
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
    {
      name: 'should work with import expressions',
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
    {
      name: 'should not validate "ui", "model", "lib", "api", "config", "assets" as group folders',
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
      name: 'should correct validate slice public api if enabled segments validation level',
      code: "import { foo } from '@/features/foo/ui';",
      filename: 'src/pages/home/ui/index.vue',
      options: setValidationLevel(VALIDATION_LEVEL.SEGMENTS),
      errors: [
        makeErrorWithSuggestion(
          'ui',
          "import { foo } from '@/features/foo';",
          '@/features/foo',
        ),
      ],
    },
    {
      name: "shouldn't allow segments without index files if enabled segments validation level",
      code: "import { useFoo } from '../model/use-foo';",
      filename: '/Users/test-user/repository/src/features/foo/ui/index.vue',
      options: setValidationLevel(VALIDATION_LEVEL.SEGMENTS),
      errors: [
        makeErrorWithSuggestion(
          'use-foo',
          "import { useFoo } from '../model';",
          '../model',
        ),
      ],
    },
    {
      name: 'import to layers public api is not allowed',
      filename: 'src/features/index.ts',
      code: "import { foo } from './foo'",
      errors: [errorLayersPublicApiNotAllowed],
    },
    {
      name: 'export from layers public api is not allowed',
      filename: 'src/features/index.ts',
      code: "export { foo } from './foo'",
      errors: [errorLayersPublicApiNotAllowed],
    },
    {
      name: 'import to layers public api is not allowed (should throw only 1 error per file)',
      filename: 'src/features/index.ts',
      code: `
        import { foo } from './foo';
        import { bar } from './bar';
        import { baz } from './baz';
      `,
      errors: 1,
    },
    /* TODO
    {
      name: 'should report if import from invalid feature sliced structure (import from known layer and unknown slice)',
      code: "import { Bar } from '@/features/group-folder/sub-group-folder/sub-sub-group/bar/bar.js';",
      filename: `${CWD_MOCK_PATH}/src/pages/home/ui/index.vue`,
      errors: [errorFromInvalidStructure],
    }, */
  ],
});
