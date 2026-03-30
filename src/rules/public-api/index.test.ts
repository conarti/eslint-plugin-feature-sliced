import * as tseslintParser from '@typescript-eslint/parser';
import { RuleTester } from '../../../tests/rule-tester';
import {
  makePublicApiErrorWithSuggestion,
  makePublicApiOptions,
  publicApiLayersNotAllowedError,
} from '../../../tests/utils';
import {
  layers,
  layersWithoutSlices,
  segments,
} from '../../config';
import { VALIDATION_LEVEL } from './config';
import rule from './index';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    parser: tseslintParser,
  },
});

const shouldNotValidateLayersWithoutSlices = layersWithoutSlices.map((layer) => ({
  name: `should not validate public api with layers that can not contain slices ("${layer}")`,
  filename: 'src/features/foo/index.ts',
  code: `import { baz } from "src/${layer}/foo/ui.ts";`,
}));

const segmentNotGroupFolderTests = segments.map((segment) => ({
  name: `should not validate "${segment}" as group folder`,
  code: `import { Bar } from '@/features/bar/${segment}';`,
  filename: 'src/pages/home/ui/index.vue',
  errors: [
    makePublicApiErrorWithSuggestion(
      segment,
      `import { Bar } from '@/features/bar';`,
      '@/features/bar',
    ),
  ],
}));

ruleTester.run('public-api', rule, {
  valid: [
    ...shouldNotValidateLayersWithoutSlices,
    {
      name: 'should work with slice public api',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'src/entities/Article'",
      filename: 'src/features/foo/ui/index.vue',
    },
    {
      name: 'should work with slice public api and alias in path',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
      filename: 'src/features/foo/ui/index.vue',
    },
    {
      name: 'should work with long paths',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'some/root/path/entities/Article'",
      filename: 'src/features/foo/ui/index.vue',
    },
    {
      name: "should not validate public api relative paths in 'app'",
      code: "import { setStylesForTheme } from 'app/providers/ThemeProvider'",
      filename: 'src/features/foo/ui/index.vue',
    },
    {
      name: 'should work with fsd segments',
      code: "import { formConfig } from 'src/features/form/config'",
      filename: 'src/features/form/ui/index.js',
    },
    {
      name: 'should work with fsd segments with file extension',
      code: "import { formConfig } from 'src/features/form/config.ts'",
      filename: 'src/features/form/ui/index.js',
    },
    {
      name: 'should work with fsd segments with relative path style',
      code: "import { formConfig } from '../config'",
      filename: 'src/features/form/ui/index.js',
    },
    {
      name: "should not validate public api paths in 'shared' (ui segment)",
      code: "import { ThemeSwitcher } from 'shared/ui/ThemeSwitcher';",
      filename: 'src/features/form/ui/index.js',
    },
    {
      name: "should not validate public api paths in 'shared' (lib segment)",
      code: "import { foo } from 'shared/lib/foo';",
      filename: 'src/features/form/ui/index.js',
    },
    {
      name: 'should work with group folders',
      code: "import { Bar } from '@/features/group-folder/bar';",
      filename: 'src/pages/home/ui/index.vue',
    },
    {
      name: 'should work with subgroup folders',
      code: "import { Bar } from '@/features/group-folder/sub-group-folder/sub-sub-group/bar';",
      filename: 'src/pages/home/ui/index.vue',
    },
    {
      name: "should not validate public api relative paths in 'shared'",
      code: "import { Bar } from '../../../constants/bar';",
      filename: 'src/shared/ui/foo/index.vue',
    },
    {
      name: 'should only swear at fsd methodology segments (assets/api/model/lib/ui/config)',
      code: "import { useFoo } from '../foo/use-foo';",
      filename: 'src/features/foo/ui/index.vue',
    },
    {
      name: 'should not validate imports inside segment',
      code: "import { Foo } from './types';",
      filename: 'src/features/foo/model/index.ts',
    },
    {
      name: "should understand 'index' files with extensions",
      code: "import { FooComponent } from './ui/index.ts';",
      filename: 'src/features/foo/index.ts',
    },
    {
      name: "should understand 'index' files with different extensions",
      code: "import FooComponent from './ui/index.vue';",
      filename: 'src/features/foo/index.ts',
    },
    {
      name: "should understand 'index' files with extensions and different layers",
      code: "import { Bar } from 'src/entities/bar/index.ts';",
      filename: 'src/features/foo/ui/index.ts',
    },
    {
      name: "should understand 'index' files without extensions and with different layers",
      code: "import { Bar } from 'src/entities/bar/index';",
      filename: 'src/features/foo/ui/index.ts',
    },
    {
      name: 'should correct read slices from paths',
      code: "import { Foo } from '../model';",
      filename: 'src/features/foo/ui/index.ts',
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
      name: 'should allow re-export from segment (named export)',
      filename: 'src/entities/room/lib/index.ts',
      code: "export { useRoom } from './useRoom';",
    },
    {
      name: 'should allow re-export from segment (star export)',
      filename: 'src/entities/room/lib/index.ts',
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
      name: 'should work ignoreFiles option',
      filename: 'src/features/index.ts',
      code: 'import { bar } from "./ui/bar";',
      options: makePublicApiOptions({ ignoreFiles: [`**/(${layers.join('|')})/index.*`] }),
    },
  ],

  invalid: [
    {
      name: 'should report import from internal segment (model)',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/file.ts'",
      errors: [
        makePublicApiErrorWithSuggestion(
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
        makePublicApiErrorWithSuggestion(
          'model/file.ts',
          "const foo = () => import('entities/Article')",
          'entities/Article',
        ),
      ],
    },
    {
      name: 'should report import with alias from internal segment',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/file.ts'",
      errors: [
        makePublicApiErrorWithSuggestion(
          'model/file.ts',
          "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
          '@/entities/Article',
        ),
      ],
    },
    {
      name: 'should report import with src prefix from internal segment',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'src/entities/Article/model/file.ts'",
      errors: [
        makePublicApiErrorWithSuggestion(
          'model/file.ts',
          "import { addCommentFormActions, addCommentFormReducer } from 'src/entities/Article'",
          'src/entities/Article',
        ),
      ],
    },
    {
      name: 'should report import with long root path from internal segment',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'some/root/path/entities/Article/model/file.ts'",
      errors: [
        makePublicApiErrorWithSuggestion(
          'model/file.ts',
          "import { addCommentFormActions, addCommentFormReducer } from 'some/root/path/entities/Article'",
          'some/root/path/entities/Article',
        ),
      ],
    },
    {
      name: 'should report import with .vue extension from internal segment',
      code: "import PassportIssuanceSearchRegistryParams from '@/entities/passport-issuance/ui/search-registry-params.vue';",
      errors: [
        makePublicApiErrorWithSuggestion(
          'ui/search-registry-params.vue',
          "import PassportIssuanceSearchRegistryParams from '@/entities/passport-issuance';",
          '@/entities/passport-issuance',
        ),
      ],
    },
    ...segmentNotGroupFolderTests,
    {
      name: 'should report import from group folder with segment',
      code: "import { Bar } from '@/features/group-folder/sub-group-folder/sub-sub-group/bar/assets';",
      filename: 'src/pages/home/ui/index.vue',
      errors: [
        makePublicApiErrorWithSuggestion(
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
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
      errors: [
        makePublicApiErrorWithSuggestion(
          'ui',
          "import { foo } from '@/features/foo';",
          '@/features/foo',
        ),
      ],
    },
    {
      name: "shouldn't allow segments without index files if enabled segments validation level",
      code: "import { useFoo } from '../model/use-foo';",
      filename: 'src/features/foo/ui/index.vue',
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
      errors: [
        makePublicApiErrorWithSuggestion(
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
      errors: [publicApiLayersNotAllowedError],
    },
    {
      name: 'export from layers public api is not allowed',
      filename: 'src/features/index.ts',
      code: "export { foo } from './foo'",
      errors: [publicApiLayersNotAllowedError],
    },
    {
      name: 'import to layers public api is not allowed (should throw only 1 error per file)',
      filename: 'src/features/index.ts',
      code: `
        import { foo } from './foo';
        import { bar } from './bar';
        import { baz } from './baz';
      `,
      errors: [publicApiLayersNotAllowedError],
    },
    {
      name: 'should remove file extension from directory import suggestion (issue #17)',
      filename: 'src/features/foo/ui/index.vue',
      code: "import { unblockNode, unblockNodesBulk } from '@/entities/node/api.ts';",
      errors: [
        makePublicApiErrorWithSuggestion(
          'api',
          "import { unblockNode, unblockNodesBulk } from '@/entities/node';",
          '@/entities/node',
        ),
      ],
    },
    {
      name: 'should report error for nested @x path',
      filename: 'src/entities/Session/model.ts',
      code: "import { User } from '@/entities/User/@x/Session/types';",
      errors: [
        makePublicApiErrorWithSuggestion(
          'types',
          "import { User } from '@/entities/User/@x/Session';",
          '@/entities/User/@x/Session',
        ),
      ],
    },
  ],
});

/* === @x cross-import tests === */

ruleTester.run('public-api (@x cross-imports)', rule, {
  valid: [
    {
      name: '@x file is valid public API',
      filename: 'src/entities/Session/model.ts',
      code: "import { User } from '@/entities/User/@x/Session';",
    },
    {
      name: '@x file with .ts extension is valid public API',
      filename: 'src/entities/Session/ui/Card.tsx',
      code: "import { User } from 'entities/User/@x/Session.ts';",
    },
    {
      name: '@x file with hyphenated names is valid public API',
      filename: 'src/entities/user-session/model.ts',
      code: "import { UserProfile } from '@/entities/user-profile/@x/user-session';",
    },
    {
      name: '@x file is valid public API with segments level',
      filename: 'src/entities/Session/model.ts',
      code: "import { User } from '@/entities/User/@x/Session';",
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
    },
    {
      name: '@x file with .ts extension is valid with segments level',
      filename: 'src/entities/Session/ui/Card.tsx',
      code: "import { User } from 'entities/User/@x/Session.ts';",
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
    },
    {
      name: '@x file with hyphenated names is valid with segments level',
      filename: 'src/entities/user-session/model.ts',
      code: "import { UserProfile } from '@/entities/user-profile/@x/user-session';",
      options: makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS }),
    },
  ],
  invalid: [],
});
