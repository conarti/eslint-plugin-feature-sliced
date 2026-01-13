import { vi } from 'vitest';
import { RuleTester } from '../../../tests/rule-tester';
import { ERROR_MESSAGE_ID } from './config';

const CWD_MOCK_PATH = '/Users/conarti/Projects/react-course';

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

const errorMustBeRelative = {
  messageId: ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH,
};

ruleTester.run('absolute-relative', rule, {
  valid: [],
  invalid: [
    {
      name: 'Import from a single slice',
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: "import { TheHeader } from 'widgets/TheHeader';",
      errors: [errorMustBeRelative],
    },
    {
      name: 'Import from a single slice and import expression',
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: "const TheHeader = () => import('widgets/TheHeader');",
      errors: [errorMustBeRelative],
    },
    {
      name: 'Export from same slice with alias (cwd-dependent)',
      filename: 'src/widgets/payments-widget-wrapper/index.ts',
      code: "export * from '@/widgets/payments-widget-wrapper/model';",
      errors: [errorMustBeRelative],
    },
    {
      name: 'Export from same slice with alias and nested path (cwd-dependent)',
      filename: 'src/widgets/blocks/MarriageDetails/index.ts',
      code: "export { MarriageDetails } from '@/widgets/blocks/MarriageDetails/MarriageDetails';",
      errors: [errorMustBeRelative],
    },
  ],
});
