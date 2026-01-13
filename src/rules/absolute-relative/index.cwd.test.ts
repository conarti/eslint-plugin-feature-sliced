import { vi } from 'vitest';
import { RuleTester } from '../../../tests/rule-tester';
import {
  TEST_CWD,
  absoluteRelativeErrors,
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

ruleTester.run('absolute-relative', rule, {
  valid: [],
  invalid: [
    {
      name: 'should report relative if import from same slice without alias',
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: "import { TheHeader } from 'widgets/TheHeader';",
      errors: [absoluteRelativeErrors.mustBeRelative],
    },
    {
      name: 'should report relative if import expression from same slice',
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: "const TheHeader = () => import('widgets/TheHeader');",
      errors: [absoluteRelativeErrors.mustBeRelative],
    },
    {
      name: 'should report relative if export from same slice with alias (cwd-dependent)',
      filename: 'src/widgets/payments-widget-wrapper/index.ts',
      code: "export * from '@/widgets/payments-widget-wrapper/model';",
      errors: [absoluteRelativeErrors.mustBeRelative],
    },
    {
      name: 'should report relative if export from same slice with nested path (cwd-dependent)',
      filename: 'src/widgets/blocks/MarriageDetails/index.ts',
      code: "export { MarriageDetails } from '@/widgets/blocks/MarriageDetails/MarriageDetails';",
      errors: [absoluteRelativeErrors.mustBeRelative],
    },
  ],
});
