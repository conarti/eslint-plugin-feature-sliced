import * as tseslintParser from '@typescript-eslint/parser';
import { RuleTester } from '../../../tests/rule-tester';
import {
  fixtureProjectPath,
  makeCrossSegmentReexportErrorWithSuggestion,
  makeCrossSegmentReexportIgnoreFilesOptions,
  makeCrossSegmentReexportIgnoreOptions,
  makeCustomSegmentsSettings,
} from '../../../tests/utils';
import rule from './index';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    parser: tseslintParser,
  },
});

ruleTester.run('no-cross-segment-reexport', rule, {
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
      name: 'should allow re-export from segment in slice public API (index.ts at slice root)',
      filename: 'src/entities/cluster/index.ts',
      code: "export { foo } from './model'",
    },
    {
      name: 'should allow same-segment internal re-export',
      filename: 'src/entities/cluster/model/index.ts',
      code: "export { foo } from './store'",
    },
    {
      name: 'should not flag regular imports (only re-exports are checked)',
      filename: 'src/entities/cluster/ui/Component.tsx',
      code: "import { useStore } from '../model'",
    },
    {
      name: 'should allow external package re-export',
      filename: 'src/entities/cluster/model/index.ts',
      code: "export { foo } from 'lodash'",
    },
    {
      name: 'should not flag layers without slices (shared)',
      filename: 'src/shared/lib/index.ts',
      code: "export { foo } from '../utils'",
    },
    {
      name: 'should allow re-export from different layer',
      filename: 'src/features/auth/model/index.ts',
      code: "export { foo } from '@/shared/lib/foo'",
    },
    {
      name: 'should allow group folder slice public API re-export',
      filename: 'src/entities/group/User/index.ts',
      code: "export { foo } from './model'",
    },
    {
      name: 'should allow re-export within same segment subfolder',
      filename: 'src/entities/cluster/model/index.ts',
      code: "export { foo } from './hooks'",
    },
    {
      name: 'should respect ignoreFiles option',
      filename: 'src/entities/cluster/model/index.ts',
      code: "export { foo } from '../api'",
      options: makeCrossSegmentReexportIgnoreFilesOptions(['**/model/index.ts']),
    },
    {
      name: 'should respect ignoreImports option',
      filename: 'src/entities/cluster/model/index.ts',
      code: "export { foo } from '../api'",
      options: makeCrossSegmentReexportIgnoreOptions(['../api']),
    },
    {
      name: 'should not flag non-re-export named exports',
      filename: 'src/entities/cluster/model/index.ts',
      code: 'export const foo = 1',
    },
    {
      name: 'should not flag named export without source',
      filename: 'src/entities/cluster/model/index.ts',
      code: 'const foo = 1; export { foo }',
    },
    {
      name: 'should not flag re-export to the same segment name',
      filename: 'src/entities/cluster/model/index.ts',
      code: "export { foo } from './model-utils'",
    },
    {
      name: 'should allow export default declaration',
      filename: 'src/entities/cluster/model/store.ts',
      code: 'const store = {}; export default store;',
    },
    {
      name: 'should not flag re-export when a segment folder sits directly under the layer',
      filename: 'src/entities/model/store/index.ts',
      code: "export { foo } from '../api'",
    },
    {
      name: 'should not flag nested re-export when a segment folder sits directly under the layer',
      filename: 'src/entities/model/store/index.ts',
      code: "export { foo } from './helpers'",
    },
    {
      name: 'should allow re-export from the slice public API index file',
      filename: 'src/entities/cluster/model/index.ts',
      code: "export { foo } from '../index.ts'",
    },
    {
      name: 'should not flag re-export from the group folder root',
      filename: 'src/entities/group/User/model/index.ts',
      code: "export { foo } from '../..'",
    },
    {
      name: 'should not flag re-export from the layer root',
      filename: 'src/entities/cluster/model/index.ts',
      code: "export { foo } from '../..'",
    },
    {
      name: 'should not flag re-export from another slice inside the same group folder',
      filename: 'src/entities/group/Admin/model/index.ts',
      code: "export { foo } from '../../User/api'",
    },
    {
      name: 'should not flag re-export from another slice at the slice public API',
      filename: 'src/entities/cluster/index.ts',
      code: "export { foo } from '../user/model'",
    },
    {
      name: 'should not flag re-export from a slice with the same name in another layer',
      filename: 'src/features/user/model/index.ts',
      code: "export { foo } from '../../../entities/user/api'",
    },
    {
      name: 'should not flag re-export from a slice-bearing layer when the current layer has no slices',
      filename: 'src/shared/lib/index.ts',
      code: "export { foo } from '../../entities/user/api'",
    },
    {
      name: 'should not flag re-export from a sibling file inside a segment folder that is not a known segment',
      filename: 'src/entities/cart/services/cart-service.ts',
      code: "export * from './helpers'",
    },
    {
      name: 'should not flag re-export from a sibling file inside a segment folder declared through settings',
      filename: 'src/entities/cart/services/cart-service.ts',
      code: "export * from './helpers'",
      settings: makeCustomSegmentsSettings(['services']),
    },
  ],
  invalid: [
    {
      name: 'should flag named re-export from sibling segment',
      filename: 'src/entities/cluster/model/index.ts',
      code: "export { foo } from '../api'",
      errors: [makeCrossSegmentReexportErrorWithSuggestion(
        'model',
        'api',
        '..',
        "export { foo } from '..'",
      )],
    },
    {
      name: 'should flag type re-export from sibling segment',
      filename: 'src/entities/cluster/model/index.ts',
      code: "export type { Foo } from '../api'",
      errors: [makeCrossSegmentReexportErrorWithSuggestion(
        'model',
        'api',
        '..',
        "export type { Foo } from '..'",
      )],
    },
    {
      name: 'should flag star re-export from sibling segment',
      filename: 'src/entities/cluster/model/index.ts',
      code: "export * from '../api'",
      errors: [makeCrossSegmentReexportErrorWithSuggestion(
        'model',
        'api',
        '..',
        "export * from '..'",
      )],
    },
    {
      name: 'should flag re-export from non-standard segment (i18n)',
      filename: 'src/entities/cluster/model/index.ts',
      code: "export { foo } from '../i18n'",
      errors: [makeCrossSegmentReexportErrorWithSuggestion(
        'model',
        'i18n',
        '..',
        "export { foo } from '..'",
      )],
    },
    {
      name: 'should flag re-export from nested file within segment',
      filename: 'src/entities/cluster/model/store/index.ts',
      code: "export { foo } from '../../api'",
      errors: [makeCrossSegmentReexportErrorWithSuggestion(
        'model',
        'api',
        '../..',
        "export { foo } from '../..'",
      )],
    },
    {
      name: 'should flag cross-segment re-export in features layer',
      filename: 'src/features/auth/ui/index.ts',
      code: "export { foo } from '../model'",
      errors: [makeCrossSegmentReexportErrorWithSuggestion(
        'ui',
        'model',
        '..',
        "export { foo } from '..'",
      )],
    },
    {
      name: 'should flag cross-segment re-export in widgets layer',
      filename: 'src/widgets/header/ui/index.ts',
      code: "export { foo } from '../model'",
      errors: [makeCrossSegmentReexportErrorWithSuggestion(
        'ui',
        'model',
        '..',
        "export { foo } from '..'",
      )],
    },
    {
      name: 'should flag cross-segment re-export in group folder',
      filename: 'src/entities/group/User/model/index.ts',
      code: "export { foo } from '../api'",
      errors: [makeCrossSegmentReexportErrorWithSuggestion(
        'model',
        'api',
        '..',
        "export { foo } from '..'",
      )],
    },
    {
      name: 'should flag cross-segment re-export when segment is a file',
      filename: 'src/entities/cluster/model.ts',
      code: "export { foo } from './api'",
      errors: [makeCrossSegmentReexportErrorWithSuggestion(
        'model',
        'api',
        '.',
        "export { foo } from '.'",
      )],
    },
    {
      name: 'should flag multiple cross-segment re-exports',
      filename: 'src/entities/cluster/model/index.ts',
      code: "export { foo } from '../api';\nexport { bar } from '../i18n';",
      errors: [
        makeCrossSegmentReexportErrorWithSuggestion(
          'model',
          'api',
          '..',
          "export { foo } from '..';\nexport { bar } from '../i18n';",
        ),
        makeCrossSegmentReexportErrorWithSuggestion(
          'model',
          'i18n',
          '..',
          "export { foo } from '../api';\nexport { bar } from '..';",
        ),
      ],
    },
    {
      name: 'should flag cross-segment re-export when target segment is a file with an extension',
      filename: 'src/entities/cluster/model/store/index.ts',
      code: "export { foo } from '../../api.ts'",
      errors: [makeCrossSegmentReexportErrorWithSuggestion(
        'model',
        'api',
        '../..',
        "export { foo } from '../..'",
      )],
    },
    {
      name: 'should flag cross-segment re-export from three levels deep within the segment',
      filename: 'src/entities/cluster/model/store/nested/index.ts',
      code: "export { foo } from '../../../api'",
      errors: [makeCrossSegmentReexportErrorWithSuggestion(
        'model',
        'api',
        '../../..',
        "export { foo } from '../../..'",
      )],
    },
    {
      name: 'should flag cross-segment re-export from a non-standard segment with a subpath (constants)',
      filename: 'src/entities/cluster/model/index.ts',
      code: "export { foo } from '../constants/theme'",
      errors: [makeCrossSegmentReexportErrorWithSuggestion(
        'model',
        'constants',
        '..',
        "export { foo } from '..'",
      )],
    },
    {
      name: 'should flag cross-segment re-export using a Windows-style backslash path',
      filename: 'src/entities/cluster/model/index.ts',
      code: "export { foo } from '..\\\\api'",
      errors: [makeCrossSegmentReexportErrorWithSuggestion(
        'model',
        'api',
        '..',
        "export { foo } from '..'",
      )],
    },
    {
      name: 'should flag cross-segment re-export in a group folder when the segment is a file',
      filename: 'src/entities/group/User/model.ts',
      code: "export { foo } from './api'",
      errors: [makeCrossSegmentReexportErrorWithSuggestion(
        'model',
        'api',
        '.',
        "export { foo } from '.'",
      )],
    },
    {
      name: 'should flag re-export from a sibling segment when the current segment is non-standard (i18n)',
      filename: 'src/entities/cluster/i18n/index.ts',
      code: "export { foo } from '../api'",
      errors: [makeCrossSegmentReexportErrorWithSuggestion(
        'i18n',
        'api',
        '..',
        "export { foo } from '..'",
      )],
    },
    {
      name: 'should flag a cross-segment re-export out of a configured custom segment',
      filename: 'src/entities/cart/services/helpers/index.ts',
      code: "export { foo } from '../../model'",
      settings: makeCustomSegmentsSettings(['services']),
      errors: [makeCrossSegmentReexportErrorWithSuggestion(
        'services',
        'model',
        '../..',
        "export { foo } from '../..'",
      )],
    },
    {
      name: 'should flag cross-segment re-export when the slice and segment folders are capitalised',
      filename: 'src/entities/Orders/Model/index.ts',
      code: "export { foo } from '../Api'",
      errors: [makeCrossSegmentReexportErrorWithSuggestion(
        'Model',
        'Api',
        '..',
        "export { foo } from '..'",
      )],
    },
  ],
});

/*
 * The filesystem route. A rule case reaches it only when its file name is a real path under
 * the working directory, so these read the on-disk fixture project instead of an invented
 * path. The shape they pin is a slice that holds a folder of its own name.
 */
ruleTester.run('no-cross-segment-reexport (resolved slice boundary)', rule, {
  valid: [
    {
      name: 'should be valid if the slice public api re-exports a segment of its own slice',
      filename: fixtureProjectPath('src/entities/panel/panel/index.ts'),
      code: "export { panelModel } from './model'",
    },
  ],
  invalid: [
    {
      name: 'should flag a cross-segment re-export inside a slice whose folder repeats the name above it',
      filename: fixtureProjectPath('src/entities/panel/panel/ui/index.ts'),
      code: "export * from '../model'",
      errors: [makeCrossSegmentReexportErrorWithSuggestion(
        'ui',
        'model',
        '..',
        "export * from '..'",
      )],
    },
  ],
});
