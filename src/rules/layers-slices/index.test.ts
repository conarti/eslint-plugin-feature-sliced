import type { Options } from './config';
import * as tseslintParser from '@typescript-eslint/parser';
import { RuleTester } from '../../../tests/rule-tester';
import {
  layersSlicesAllowTypeImportsOptions,
  makeInvalidCrossImportError,
  makeLayersSlicesError,
  makeLayersSlicesErrorAtSpecifier,
  makeLayersSlicesIgnoreInFilesOptions,
  makeLayersSlicesIgnoreOptions,
} from '../../../tests/utils';
import rule from './index';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    parser: tseslintParser,
  },
});

ruleTester.run('layers-slices', rule, {
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
    {
      name: 'should be valid if import from "shared" to "features"',
      filename: 'src/features/bar/ui.tsx',
      code: "import { foo } from '@/shared/foo.tsx'",
    },
    {
      name: 'should be valid if import from "entities" to "features"',
      filename: 'src/features/bar/ui.tsx',
      code: "import { foo } from '@/entities/foo.tsx'",
    },
    {
      name: 'should work with Windows paths (import widgets to app)',
      filename: 'C:\\Users\\tim\\Desktop\\project\\src\\app\\providers',
      code: "import { addCommentFormActions } from '@/widgets/Articl'",
    },
    {
      name: 'should work with external packages',
      filename: 'src/widgets/pages',
      code: "import { useLocation } from 'react-router-dom'",
    },
    {
      name: 'should work with external packages (redux)',
      filename: 'src/app/providers',
      code: "import { addCommentFormActions } from 'redux'",
    },
    {
      name: 'should allow import from root index to app',
      filename: 'src/index.tsx',
      code: "import { StoreProvider } from '@/app/providers/StoreProvider';",
    },
    {
      name: 'should be valid if import within same layer (shared)',
      filename: 'src/shared/ui/foo',
      code: "import { Baz } from 'shared/bar';",
    },
    {
      name: 'should be valid if import within same layer (app)',
      filename: 'src/app/App.tsx',
      code: "import { AppRouter } from 'app/providers/router';",
    },
    {
      name: 'should be valid if import within same layer (shared) when the target path carries a slice-capable layer name segment',
      filename: 'src/shared/ui/foo/index.ts',
      code: "import { Bar } from 'shared/entities/User/foo';",
    },
    {
      name: 'should allow "import type" with enabled option (separate import type style and same layer)',
      filename: 'src/entities/bar',
      code: "import type { Baz } from 'entities/baz';",
      options: layersSlicesAllowTypeImportsOptions,
    },
    {
      name: 'should allow "import type" with enabled option (separate import type style and to layer below)',
      filename: 'src/shared/ui/foo',
      code: "import type { Bar } from '@/entities/bar';",
      options: layersSlicesAllowTypeImportsOptions,
    },
    {
      name: 'should allow "import type" with enabled option (inline import type style and to layer below)',
      filename: 'src/shared/ui/foo',
      code: "import { type Bar } from '@/entities/bar';",
      options: layersSlicesAllowTypeImportsOptions,
    },
    {
      name: 'should allow type imports by default',
      filename: 'src/shared/utils/index.ts',
      code: "import type { Foo } from '@/widgets/foo';",
    },
    {
      name: 'should work with ignoreImports (exact match)',
      filename: 'src/shared/ui/foo',
      code: "import { Bar } from '@/entities/bar';",
      options: makeLayersSlicesIgnoreOptions(['@/entities/bar']),
    },
    {
      name: 'should work with ignoreImports (wildcard)',
      filename: 'src/shared/ui/foo',
      code: "import { Bar } from '@/entities/bar';",
      options: makeLayersSlicesIgnoreOptions(['**/bar']),
    },
    {
      name: 'should be valid if import within same slice',
      filename: 'src/entities/bar/ui',
      code: "import { Bar } from '@/entities/bar/model';",
    },
    {
      name: 'should be valid if relative import within same layer (shared)',
      filename: 'src/shared/ui/foo/index.ts',
      code: "import { useBar } from '../../../hooks/useBar.ts';",
    },
    {
      name: 'should be valid if import from self (index.ts)',
      filename: 'src/shared/ui/foo/index.test.ts',
      code: "import { Foo } from './index.ts';",
    },
    {
      name: 'should be valid if import from self (dot)',
      filename: 'src/shared/ui/foo/index.test.ts',
      code: "import { Foo } from '.';",
    },
    {
      name: 'should be valid if relative import within same slice',
      filename: 'src/pages/foo-bar/lib/index.ts',
      code: "import generatePayloadMapper from './generatePayloadMapper';",
    },
    {
      name: "should be valid if import inside 'app' layer",
      filename: 'src/app/foo/index.ts',
      code: "import { Bar } from '../bar';",
    },
    {
      name: "should be valid if has 'layer' name at not layer path part",
      filename: 'src/features/foo/index.ts',
      code: "import { Bar } from 'src/entities/app-bar';",
    },
    {
      name: 'should work with ignoreFiles',
      filename: 'src/features/index.ts',
      code: "import { Bar } from 'src/features/bar';",
      options: makeLayersSlicesIgnoreInFilesOptions(['**/src/(shared|entities|features|widgets|pages|processes|app)/index.ts']),
    },
    {
      name: 'should work with ignoreFiles under a directory whose name starts with a dot',
      filename: '/proj/.worktrees/w1/src/entities/user/model/a.ts',
      code: "import { a } from 'src/features/auth';",
      options: makeLayersSlicesIgnoreInFilesOptions(['**/entities/**']),
    },
    {
      name: 'should work with ignoreImports when the import path carries a dot directory',
      filename: 'src/shared/ui/foo.ts',
      code: "import { a } from 'src/.generated/entities/api';",
      options: makeLayersSlicesIgnoreOptions(['**/entities/**']),
    },
    /*
     * The filename has to sit inside a layer and carry an import the rule would
     * otherwise report, or the rule returns before the ignore check and the case
     * passes whatever the matcher does
     */
    {
      name: 'should keep ignoring a dotted file matched by a negated ignoreFiles pattern',
      filename: 'src/entities/.generated/a.ts',
      code: "import { a } from 'src/features/auth';",
      options: makeLayersSlicesIgnoreInFilesOptions(['!src/**']),
    },
    /*
     * An import that never leaves the slice it starts in is not a cross-slice import,
     * whichever of the two sides sits in a folder that is not a known segment (issue #41)
     */
    {
      name: 'should be valid if an import stays inside the slice of the current file (issue #41)',
      filename: 'src/widgets/header/Header.ts',
      code: "import { other } from '@/widgets/header/hooks';",
    },
    {
      name: 'should be valid if an import stays inside the slice of the current file, nested deeper (issue #41)',
      filename: 'src/widgets/header/Header.ts',
      code: "import { other } from '@/widgets/header/hooks/use-x';",
    },
    {
      name: 'should be valid if a file in a segment reaches an unknown folder of its own slice (issue #41)',
      filename: 'src/widgets/header/ui/H.ts',
      code: "import { other } from '@/widgets/header/hooks/use-x';",
    },
    {
      name: 'should be valid if a file in an unknown folder reaches a segment of its own slice (issue #41)',
      filename: 'src/features/leaderboard/actions/get-top.ts',
      code: "import { u } from '@/features/leaderboard/lib/utils';",
    },
    {
      name: 'should be valid if a relative import stays inside the slice of the current file (issue #41)',
      filename: 'src/widgets/header/ui/H.ts',
      code: "import { other } from '../hooks/use-x';",
    },
    {
      name: 'should be valid if a relative import from an unknown folder reaches a segment of its own slice (issue #41)',
      filename: 'src/features/leaderboard/actions/get-top.ts',
      code: "import { u } from '../lib/utils';",
    },
  ],

  invalid: [
    {
      name: 'should be invalid if import from "features" to "entities" (Windows path)',
      filename: 'C:\\Users\\tim\\Desktop\\project\\src\\entities\\providers',
      code: "import { addCommentFormActions } from '@/features/Articl'",
      errors: [makeLayersSlicesError('features', 'entities')],
    },
    {
      name: 'should work with import expressions',
      filename: 'src/entities/providers',
      code: "const foo = () => import('@/features/Articl')",
      errors: [makeLayersSlicesError('features', 'entities')],
    },
    {
      name: 'should be invalid if import "widgets" to "features"',
      filename: 'src/features/providers',
      code: "import { addCommentFormActions } from '@/widgets/Articl'",
      errors: [makeLayersSlicesError('widgets', 'features')],
    },
    {
      name: 'should be invalid if import "widgets" to "entities"',
      filename: 'src/entities/providers',
      code: "import { addCommentFormActions } from '@/widgets/Articl'",
      errors: [makeLayersSlicesError('widgets', 'entities')],
    },
    {
      name: 'should be invalid if import "entities" to "shared" (to layer without slices)',
      filename: 'src/shared/ui/foo',
      code: "import { StoreProvider } from '@/entities/bar';",
      errors: [makeLayersSlicesError('entities', 'shared')],
    },
    {
      name: 'should be invalid if import "app" to "shared" (layers without slices)',
      filename: 'src/shared/ui/foo',
      code: "import { StoreProvider } from 'app/bar';",
      errors: [makeLayersSlicesError('app', 'shared')],
    },
    {
      name: 'should be invalid if import from same layer different slice (entities)',
      filename: 'src/entities/bar',
      code: "import { Baz } from 'entities/baz';",
      errors: [makeLayersSlicesError('entities', 'entities')],
    },
    {
      name: 'should be invalid if relative import cross-slice (entities)',
      filename: 'src/entities/article/model/services.ts',
      code: "import { userModel } from '../../user';",
      errors: [makeLayersSlicesError('entities', 'entities')],
    },
    {
      name: 'should be invalid if relative import to higher layer',
      filename: 'src/entities/foo/model.ts',
      code: "import { bar } from '../../../features/bar';",
      errors: [makeLayersSlicesError('features', 'entities')],
    },
    {
      name: 'should be invalid if relative import to higher layer (layer itself)',
      filename: 'src/entities/foo/model.ts',
      code: "import { bar } from '../../../features';",
      errors: [makeLayersSlicesError('features', 'entities')],
    },
    {
      name: 'should be invalid if relative cross-slice import (same layer)',
      filename: 'src/entities/foo-bar-baz/ui/index.vue',
      code: "import { FooBar } from '../../foo-bar/ui/index.vue';",
      errors: [makeLayersSlicesError('entities', 'entities')],
    },
    {
      name: 'should still flag relative cross-slice import from a slice with non-segment subfolders',
      filename: 'src/features/foo/components/bar/bar.tsx',
      code: "import { Other } from '../../../other/baz';",
      errors: [makeLayersSlicesError('features', 'features')],
    },
    {
      name: 'should detect layer correctly if there are layer names in the path',
      filename: 'src/entities/Viewer/model/types.ts',
      code: "import { u } from '../../../entities/User';",
      errors: [makeLayersSlicesError('entities', 'entities')],
    },
    {
      name: 'should be invalid if import same layer from public api',
      filename: 'src/features/index.ts',
      code: "import { Bar } from 'src/features/bar';",
      errors: [makeLayersSlicesError('features', 'features')],
    },
    {
      name: 'should allow "import type" with enabled option, but throw errors for value imports',
      filename: 'src/shared/ui/foo',
      code: "import { type Bar, bar } from '@/entities/bar';",
      options: layersSlicesAllowTypeImportsOptions,
      errors: [makeLayersSlicesError('entities', 'shared')],
    },
    {
      name: 'should throw error for every specifier at correct positions and should not for valid specifiers',
      filename: 'src/shared/ui/foo',
      code: [
        'import { bar, type Bar,',
        '  baz,',
        '  type Boz,',
        '  boz,',
        "} from '@/entities/bar';",
      ].join('\n'),
      options: layersSlicesAllowTypeImportsOptions,
      errors: [
        makeLayersSlicesErrorAtSpecifier(
          'entities',
          'shared',
          {
            line: 1,
            endLine: 1,
            column: 10,
            endColumn: 13,
          },
        ),
        makeLayersSlicesErrorAtSpecifier(
          'entities',
          'shared',
          {
            line: 2,
            endLine: 2,
            column: 3,
            endColumn: 6,
          },
        ),
        makeLayersSlicesErrorAtSpecifier(
          'entities',
          'shared',
          {
            line: 4,
            endLine: 4,
            column: 3,
            endColumn: 6,
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
      errors: [makeLayersSlicesError('entities', 'shared')],
    },
    {
      name: 'should throw error when importing from higher layer with same slice name',
      filename: 'src/entities/orders/model.ts',
      code: "import { foo } from '../../../pages/orders/ui';",
      errors: [makeLayersSlicesError('pages', 'entities')],
    },
    {
      name: 'should throw error for @x import from wrong slice',
      filename: 'src/entities/Order/model.ts',
      code: "import { User } from '@/entities/User/@x/Session';",
      errors: [makeInvalidCrossImportError('User', 'Session')],
    },
    {
      name: 'should throw error for @x import from wrong slice (different slice)',
      filename: 'src/entities/Product/ui/Card.tsx',
      code: "import { User } from 'entities/User/@x/Session';",
      errors: [makeInvalidCrossImportError('User', 'Session')],
    },
    {
      name: 'should still report if an ignoreFiles pattern matches no part of a dotted path',
      filename: '/proj/.worktrees/w1/src/entities/user/model/a.ts',
      code: "import { a } from 'src/features/auth';",
      options: makeLayersSlicesIgnoreInFilesOptions(['**/widgets/**']),
      errors: [makeLayersSlicesError('features', 'entities')],
    },
    /*
     * Controls for issue #41. Each pair uses slices that sit directly under their layer,
     * so the same-slice guard must leave every one of them reporting
     */
    {
      name: 'should still report an import that leaves the slice of the current file (issue #41 control)',
      filename: 'src/widgets/header/Header.ts',
      code: "import { other } from '@/widgets/footer/hooks';",
      errors: [makeLayersSlicesError('widgets', 'widgets')],
    },
    {
      name: 'should still report an import into a segment of another slice (issue #41 control)',
      filename: 'src/entities/user/model/a.ts',
      code: "import { x } from '@/entities/other/model/x';",
      errors: [makeLayersSlicesError('entities', 'entities')],
    },
    {
      name: 'should still report an import into an upper layer (issue #41 control)',
      filename: 'src/entities/user/model/a.ts',
      code: "import { auth } from '@/features/auth';",
      errors: [makeLayersSlicesError('features', 'entities')],
    },
  ],
});

/* === @x cross-import tests === */

ruleTester.run('layers-slices (@x cross-imports)', rule, {
  valid: [
    {
      name: 'should allow @x cross-import from correct target slice',
      filename: 'src/entities/Session/model.ts',
      code: "import { User } from '@/entities/User/@x/Session';",
    },
    {
      name: 'should allow @x cross-import with .ts extension',
      filename: 'src/entities/Session/model.ts',
      code: "import { User } from '@/entities/User/@x/Session.ts';",
    },
    {
      name: 'should allow @x cross-import from nested file in target slice',
      filename: 'src/entities/Session/ui/Card.tsx',
      code: "import { User } from 'entities/User/@x/Session';",
    },
    {
      name: 'should allow @x cross-import with hyphenated slice names',
      filename: 'src/entities/user-session/model.ts',
      code: "import { UserProfile } from '@/entities/user-profile/@x/user-session';",
    },
    {
      name: 'should allow @x cross-import with group folders',
      filename: 'src/entities/users/Session/model.ts',
      code: "import { User } from '@/entities/users/User/@x/Session';",
    },
    /* An @x file is the cross-import public api of its own slice and may reach that slice */
    {
      name: 'should allow an @x file to import from its own slice (issue #40)',
      filename: 'src/entities/foo/@x/bar.ts',
      code: "import { thing } from '../model/thing';",
    },
    /*
     * Only the @x guard answers this one: the slice of the current file resolves to
     * the @x folder itself and the slice of the target to the folder that holds it,
     * so neither truncated side contains the other and the same-slice guard is silent
     */
    {
      name: 'should allow an @x file to import an unknown folder of its own slice (issue #40)',
      filename: 'src/entities/foo/@x/bar.ts',
      code: "import { thing } from '@/entities/foo/hooks/use-x';",
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
  ],
  invalid: [
    {
      name: 'should report an @x file that reaches into another slice',
      filename: 'src/entities/foo/@x/bar.ts',
      code: "import { thing } from '@/entities/other/model/thing';",
      errors: [makeLayersSlicesError('entities', 'entities')],
    },
    /*
     * An @x folder placed on the layer itself has no slice to stand for, so the
     * guard must not treat the whole layer as one slice
     */
    {
      name: 'should report an @x folder placed on the layer reaching another slice',
      filename: 'src/entities/@x/bar.ts',
      code: "import { secret } from '@/entities/other/model/secret';",
      errors: [makeLayersSlicesError('entities', 'entities')],
    },
    {
      name: 'should report an @x folder placed on the layer from inside a segment',
      filename: 'src/entities/@x/model/thing.ts',
      code: "import { secret } from '@/entities/other/model/secret';",
      errors: [makeLayersSlicesError('entities', 'entities')],
    },
    {
      name: 'should report an @x folder placed on the layer with a bare specifier',
      filename: 'src/entities/@x/bar.ts',
      code: "import { secret } from 'src/entities/other/model/secret';",
      errors: [makeLayersSlicesError('entities', 'entities')],
    },
  ],
});

/*
 * === [GF] Group folders smoke tests ===
 *
 * These cases pin the group folder decision: a folder between the layer and the slice
 * is not itself a slice. Step B5 is the only step allowed to change what they expect.
 */

ruleTester.run('layers-slices (group folders)', rule, {
  valid: [
    {
      name: 'should allow import within same slice with group folder',
      filename: 'src/entities/group/User/ui/index.ts',
      code: "import { userModel } from '../model';",
    },
    {
      name: 'should allow relative import within same slice with nested group folders',
      filename: 'src/features/auth/forms/LoginForm/ui/index.ts',
      code: "import { useLogin } from '../model';",
    },
  ],
  invalid: [
    {
      name: 'should report cross-slice import with group folders',
      filename: 'src/entities/users/User/model/index.ts',
      code: "import { foo } from '@/entities/products/Product/model';",
      errors: [makeLayersSlicesError('entities', 'entities')],
    },
    {
      name: 'should report relative cross-slice import with group folders',
      filename: 'src/entities/users/User/model/index.ts',
      code: "import { admin } from '../../Admin/model';",
      errors: [makeLayersSlicesError('entities', 'entities')],
    },
    /*
     * Pinned deliberately rather than assumed. Under the filesystem slice resolution
     * chosen for step B5 this expectation must not change; if B5 finds it changing,
     * the resolution is wrong. No other step may touch this case.
     */
    {
      name: '[GF] group folders: UserA and UserB are different slices today',
      filename: 'src/entities/group/UserA/ui/a.ts',
      code: "import { b } from '@/entities/group/UserB/ui';",
      errors: [makeLayersSlicesError('entities', 'entities')],
    },
  ],
});
