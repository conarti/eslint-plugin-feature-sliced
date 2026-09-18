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
    {
      name: 'should be valid if a dynamic import source is a template literal',
      filename: 'src/app/providers/i18n.ts',
      /* eslint-disable-next-line no-template-curly-in-string -- the code under test is a template literal */
      code: 'const load = (l: string) => import(`./locales/${l}.json`)',
    },
    {
      name: 'should be valid if a dynamic import source is an identifier',
      filename: 'src/app/providers/i18n.ts',
      code: 'const load = (p: string) => import(p)',
    },
    {
      name: 'should be valid if a dynamic import source is a call expression',
      filename: 'src/app/providers/i18n.ts',
      code: 'const load = (p: string) => import(String(p))',
    },
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
    {
      name: 'should be valid if ignoreImports has an exact-path entry matching the import',
      filename: 'src/pages/orders/ui/OrderDetailsPage.vue',
      code: "import { getOrderById } from '@/entities/orders/api';",
      options: makePublicApiOptions({ ignoreImports: ['@/entities/orders/api'] }),
    },
    {
      name: 'should be valid if ignoreImports has a wildcard entry matching the import',
      filename: 'src/pages/orders/ui/OrderDetailsPage.vue',
      code: "import { getOrderById } from '@/entities/orders/api';",
      options: makePublicApiOptions({ ignoreImports: ['**/orders/api'] }),
    },
    {
      name: 'should work with multiple layer names in path (correct understand layer)',
      filename: 'src/processes/shared/index.js',
      code: "import { foo } from 'shared/foo';",
    },
    {
      name: 'should be valid if import from same slice and slice contain "layer" name',
      filename: 'src/features/foo-pages/ui/foo.vue',
      code: "import { foo } from '../model'",
    },
    /*
     * An import that never leaves the slice it starts in does not go through
     * the public api of that slice, so it must not be asked for one (issue #41)
     */
    {
      name: 'should be valid if a file in an unknown folder reaches a segment of its own slice (issue #41)',
      filename: 'src/features/leaderboard/actions/get-top.ts',
      code: "import { u } from '@/features/leaderboard/lib/utils';",
    },
    {
      name: 'should be valid if a relative import from an unknown folder reaches a segment of its own slice (issue #41)',
      filename: 'src/features/leaderboard/actions/get-top.ts',
      code: "import { u } from '../lib/utils';",
    },
    {
      name: 'should keep an import into an unknown folder of the current slice valid (issue #41 control)',
      filename: 'src/widgets/header/Header.ts',
      code: "import { other } from '@/widgets/header/hooks';",
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
      code: "import DocumentRegistrySearchParams from '@/entities/document-registry/ui/search-registry-params.vue';",
      errors: [
        makePublicApiErrorWithSuggestion(
          'ui/search-registry-params.vue',
          "import DocumentRegistrySearchParams from '@/entities/document-registry';",
          '@/entities/document-registry',
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
    /* Original identifiers in the issue #18 report: PolicyNodeDetailsPage, policies, getNodePolicyById. */
    {
      name: 'should throw error when importing from different layer with same slice name (api segment) (issue #18)',
      filename: 'src/pages/orders/ui/OrderDetailsPage.vue',
      code: "import { getOrderById } from '@/entities/orders/api';",
      errors: [
        makePublicApiErrorWithSuggestion(
          'api',
          "import { getOrderById } from '@/entities/orders';",
          '@/entities/orders',
        ),
      ],
    },
    /* Original identifiers in the issue #18 report: PolicyNodeDetailsPage, policies, createNodePolicyFields. */
    {
      name: 'should throw error when importing from different layer with same slice name (lib segment) (issue #18)',
      filename: 'src/pages/orders/ui/OrderDetailsPage.vue',
      code: "import { createOrderFields } from '@/entities/orders/lib';",
      errors: [
        makePublicApiErrorWithSuggestion(
          'lib',
          "import { createOrderFields } from '@/entities/orders';",
          '@/entities/orders',
        ),
      ],
    },
    {
      name: 'should throw error when re-exporting from different layer with same slice name (named export)',
      filename: 'src/pages/orders/ui/OrderDetailsPage.vue',
      code: "export { getOrderById } from '@/entities/orders/api';",
      errors: [
        makePublicApiErrorWithSuggestion(
          'api',
          "export { getOrderById } from '@/entities/orders';",
          '@/entities/orders',
        ),
      ],
    },
    {
      name: 'should throw error when re-exporting from different layer with same slice name (star export)',
      filename: 'src/pages/orders/ui/OrderDetailsPage.vue',
      code: "export * from '@/entities/orders/api';",
      errors: [
        makePublicApiErrorWithSuggestion(
          'api',
          "export * from '@/entities/orders';",
          '@/entities/orders',
        ),
      ],
    },
    {
      name: 'should still report should-be-from-public-api if ignoreImports has a near-miss pattern',
      filename: 'src/pages/orders/ui/OrderDetailsPage.vue',
      code: "import { getOrderById } from '@/entities/orders/api';",
      options: makePublicApiOptions({ ignoreImports: ['**/orders/model'] }),
      errors: [
        makePublicApiErrorWithSuggestion(
          'api',
          "import { getOrderById } from '@/entities/orders';",
          '@/entities/orders',
        ),
      ],
    },
    {
      name: 'should still report an import into a segment of another slice (issue #41 control)',
      filename: 'src/entities/user/model/a.ts',
      code: "import { x } from '@/entities/other/model/x';",
      errors: [
        makePublicApiErrorWithSuggestion(
          'model/x',
          "import { x } from '@/entities/other';",
          '@/entities/other',
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
    /* An @x file is the cross-import public api of its own slice and may reach that slice */
    {
      name: 'should allow an @x file to re-export from its own slice (issue #40)',
      filename: 'src/entities/foo/@x/bar.ts',
      code: "export { thing } from '../model/thing';",
    },
    {
      name: 'should allow an @x file to import from its own slice (issue #40)',
      filename: 'src/entities/foo/@x/bar.ts',
      code: "import { thing } from '../model/thing';",
    },
    {
      name: 'should allow an @x file to import from its own slice through an alias (issue #40)',
      filename: 'src/entities/foo/@x/bar.ts',
      code: "import { thing } from '@/entities/foo/model/thing';",
    },
    {
      name: 'should allow an @x file to import from its own slice through a bare specifier (issue #40)',
      filename: 'src/entities/foo/@x/bar.ts',
      code: "import { thing } from 'src/entities/foo/model/thing';",
    },
    /*
     * Only the @x guard answers this one: the slice of the current file resolves to
     * the @x folder and the slice of the target to the folder above its segment, so
     * neither truncated side contains the other and the same-slice guard is silent
     */
    {
      name: 'should allow an @x file to import through a nested folder of its own slice (issue #40)',
      filename: 'src/entities/foo/@x/bar.ts',
      code: "import { x } from '@/entities/foo/hooks/model/x';",
    },
    {
      name: 'should keep the same re-export silent in the slice public api',
      filename: 'src/entities/foo/index.ts',
      code: "export { thing } from '../model/thing';",
    },
  ],
  invalid: [
    {
      name: 'should report an @x file that reaches into another slice',
      filename: 'src/entities/foo/@x/bar.ts',
      code: "export { thing } from 'src/entities/other/model/thing';",
      errors: [
        makePublicApiErrorWithSuggestion(
          'model/thing',
          "export { thing } from 'src/entities/other';",
          'src/entities/other',
        ),
      ],
    },
    /*
     * An @x folder placed on the layer itself has no slice to stand for, so the
     * guard must not treat the whole layer as one slice
     */
    {
      name: 'should report an @x folder placed on the layer reaching another slice',
      filename: 'src/entities/@x/bar.ts',
      code: "import { secret } from '@/entities/other/model/secret';",
      errors: [
        makePublicApiErrorWithSuggestion(
          'model/secret',
          "import { secret } from '@/entities/other';",
          '@/entities/other',
        ),
      ],
    },
    {
      name: 'should report an @x folder placed on the layer from inside a segment',
      filename: 'src/entities/@x/model/thing.ts',
      code: "import { secret } from '@/entities/other/model/secret';",
      errors: [
        makePublicApiErrorWithSuggestion(
          'model/secret',
          "import { secret } from '@/entities/other';",
          '@/entities/other',
        ),
      ],
    },
    {
      name: 'should report an @x folder placed on the layer with a bare specifier',
      filename: 'src/entities/@x/bar.ts',
      code: "import { secret } from 'src/entities/other/model/secret';",
      errors: [
        makePublicApiErrorWithSuggestion(
          'model/secret',
          "import { secret } from 'src/entities/other';",
          'src/entities/other',
        ),
      ],
    },
  ],
});
