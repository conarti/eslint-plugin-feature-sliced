import { vi } from 'vitest';
import { RuleTester } from '../../../tests/rule-tester';
import {
  TEST_CWD,
  makeLayersSlicesError,
} from '../../../tests/utils';

vi.mock('../../lib/rule/extract-cwd', () => ({
  extractCwd: () => TEST_CWD,
}));

const { default: rule } = await import('./index');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    parser: require('@typescript-eslint/parser'),
  },
});

ruleTester.run('layers-slices', rule, {
  valid: [
    {
      name: 'should be valid if import from same slice and slice contain "layer" name',
      filename: 'src/features/foo-pages/ui/foo.vue',
      code: "import { foo } from '../model'",
    },
    {
      name: 'should be valid if import within same layer and same slice',
      filename: 'src/pages/policies/ui/PolicyPage.vue',
      code: "import { foo } from '../model'",
    },
  ],
  invalid: [
    {
      name: 'should work with custom cwd and alias imports',
      filename: 'src/entities/Viewer/model/types.ts',
      code: "import { u } from '@/entities/User';",
      errors: [makeLayersSlicesError('entities', 'entities')],
    },
    {
      name: 'should work with custom cwd for cross-layer same-slice imports',
      filename: 'src/entities/policies/model.ts',
      code: "import { foo } from '@/pages/policies/ui';",
      errors: [makeLayersSlicesError('pages', 'entities')],
    },
  ],
});
