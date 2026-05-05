import * as tseslintParser from '@typescript-eslint/parser';
import { vi } from 'vitest';
import { RuleTester } from '../../../tests/rule-tester';
import {
  makePublicApiErrorWithSuggestion,
  TEST_CWD,
} from '../../../tests/utils';

vi.mock('../../lib/rule/extract-cwd', () => ({
  extractCwd: () => TEST_CWD,
}));

const { default: rule } = await import('./index');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    parser: tseslintParser,
  },
});

ruleTester.run('public-api', rule, {
  valid: [
    {
      name: 'should work with multiple layer names in path (correct understand layer)',
      filename: 'src/processes/shared/index.js',
      code: "import { foo } from 'shared/foo';",
    },
    {
      name: 'should work with multiple layer names in path (correct understand layer using "cwd")',
      filename: 'index.js',
      code: "import { foo } from 'shared/foo';",
    },
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
    {
      name: '@x cross-import is valid public API (cwd-dependent)',
      filename: 'src/entities/Session/model/index.ts',
      code: "import { User } from '@/entities/User/@x/Session';",
    },
  ],
  invalid: [
    {
      name: 'should throw error when importing from different layer with same slice name (api segment)',
      filename: 'src/pages/policies/ui/PolicyNodeDetailsPage.vue',
      code: "import { getNodePolicyById } from '@/entities/policies/api';",
      errors: [
        makePublicApiErrorWithSuggestion(
          'api',
          "import { getNodePolicyById } from '@/entities/policies';",
          '@/entities/policies',
        ),
      ],
    },
    {
      name: 'should throw error when importing from different layer with same slice name (lib segment)',
      filename: 'src/pages/policies/ui/PolicyNodeDetailsPage.vue',
      code: "import { createNodePolicyFields } from '@/entities/policies/lib';",
      errors: [
        makePublicApiErrorWithSuggestion(
          'lib',
          "import { createNodePolicyFields } from '@/entities/policies';",
          '@/entities/policies',
        ),
      ],
    },
  ],
});
