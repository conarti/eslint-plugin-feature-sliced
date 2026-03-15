import * as tseslintParser from '@typescript-eslint/parser';
import { RuleTester } from '../../../tests/rule-tester';
import {
  makeCrossSegmentReexportErrorWithSuggestion,
  makeCrossSegmentReexportIgnoreFilesOptions,
  makeCrossSegmentReexportIgnoreOptions,
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
  ],
});
