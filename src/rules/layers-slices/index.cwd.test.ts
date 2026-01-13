import { vi } from 'vitest';
import type { TSESLint } from '@typescript-eslint/utils';
import type { Layer } from '../../config';
import { RuleTester } from '../../../tests/rule-tester';
import { ERROR_MESSAGE_ID, type MessageIds } from './config';

const CWD_MOCK_PATH = '/Users/user/projects/project/app';

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

function makeErrorMessage(importLayer: Layer, currentFileLayer: Layer): TSESLint.TestCaseError<MessageIds> {
  return {
    messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
    data: {
      importLayer,
      currentFileLayer,
    },
  };
}

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
      errors: [makeErrorMessage('entities', 'entities')],
    },
    {
      name: 'should work with custom cwd for cross-layer same-slice imports',
      filename: 'src/entities/policies/model.ts',
      code: "import { foo } from '@/pages/policies/ui';",
      errors: [makeErrorMessage('pages', 'entities')],
    },
  ],
});
