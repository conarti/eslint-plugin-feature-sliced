import { vi } from 'vitest';
import { RuleTester } from '../../../tests/rule-tester';
import { MESSAGE_ID } from './config';

const CWD_MOCK_PATH = '/Users/User/Projects/app';

vi.mock('../../lib/rule/extract-cwd', () => ({
  extractCwd: () => CWD_MOCK_PATH,
}));

const { default: rule } = await import('./index');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    parser: require('@typescript-eslint/parser'),
  },
});

function makeErrorWithSuggestion(suggestionSegments: string, suggestionOutput: string, fixedPath: string) {
  return {
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
  };
}

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
  ],
  invalid: [
    {
      name: 'should throw error when importing from different layer with same slice name (api segment)',
      filename: 'src/pages/policies/ui/PolicyNodeDetailsPage.vue',
      code: "import { getNodePolicyById } from '@/entities/policies/api';",
      errors: [
        makeErrorWithSuggestion(
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
        makeErrorWithSuggestion(
          'lib',
          "import { createNodePolicyFields } from '@/entities/policies';",
          '@/entities/policies',
        ),
      ],
    },
  ],
});
