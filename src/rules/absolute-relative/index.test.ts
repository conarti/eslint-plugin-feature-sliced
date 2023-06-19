import { ESLintUtils } from '@typescript-eslint/utils';
import { ERROR_MESSAGE_ID } from './config';
import rule from './index';

const ruleTester = new ESLintUtils.RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  parser: '@typescript-eslint/parser',
});

const errorMustBeAbsolute = {
  messageId: ERROR_MESSAGE_ID.MUST_BE_ABSOLUTE_PATH,
};

const errorMustBeRelative = {
  messageId: ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH,
};

const makeIgnoreInFilesOptions = (patterns: string[]): [{ ignoreInFilesPatterns: string[] }] => [
  {
    ignoreInFilesPatterns: patterns,
  },
];

ruleTester.run('absolute-relative', rule, {
  valid: [
    {
      filename: '/Users/conarti/Projects/react-course/src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: "import { TheHeader } from './TheHeader';",
    },
    {
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: "import { useBar } from 'src/shared/hooks';",
    },
    {
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: "import { useBar } from '../../lib';",
    },
    {
      filename: 'src/app/App.tsx',
      code: "import { AppRouter } from './providers/router';",
    },
    {
      filename: 'src/app/App.tsx',
      code: "import { Foo } from 'widgets/foo';",
    },
    {
      filename: 'src/pages/passport-info-case-edit/lib/index.ts',
      code: "import generatePayloadMapper from './generatePayloadMapper';",
    },
    {
      filename: '/Users/conarti/Projects/bp-passport-rf-frontend/src/widgets/payments-widget-wrapper/index.ts',
      code: "export * from './model';",
    },
    {
      filename: '/Users/conarti/Projects/bp-passport-rf-frontend/src/components/blocks/MarriageDetails/index.ts',
      code: "export { MarriageDetails } from './MarriageDetails';",
    },
    {
      name: 'should be valid if it has ignored in files options',
      filename: '/Users/conarti/Projects/frontend/src/shared/foo/index.ts',
      code: "import { BAR } from '@/shared/bar';",
      options: makeIgnoreInFilesOptions(['**/*/shared/foo/**/*']),
    },
    {
      // FIXME: should works without extra options
      name: "should be valid if it has slice with 'layer' name",
      filename: '/Users/conarti/Projects/frontend/src/processes/shared/index.ts',
      code: 'import { BAR } from \'@/shared/constants\';',
      options: makeIgnoreInFilesOptions(['**/*/processes/shared/**/*']),
    },
    {
      name: 'should be valid if the import is not from a layer (absolute import)',
      filename: '/Users/conarti/Projects/frontend/src/shared/foo/index.ts',
      code: 'import { BAR } from \'@/bar\';',
    },
    {
      name: 'should be valid if the import is not from a layer (relative import)',
      filename: '/Users/conarti/Projects/frontend/src/shared/foo/index.ts',
      code: "import { BAR } from '../../../bar';",
    },
    {
      name: 'should be valid if the import is not from a slice (absolute import)',
      filename: 'frontend/src/shared/foo/index.ts',
      code: "import { Something } from '@/app';",
    },
  ],

  invalid: [
    {
      name: 'Import from a single slice',
      filename: '/Users/conarti/Projects/react-course/src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { TheHeader } from \'widgets/TheHeader\';',
      errors: [errorMustBeRelative],
    },
    {
      name: 'Import from a single slice and import expression',
      filename: '/Users/conarti/Projects/react-course/src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'const TheHeader = () => import(\'widgets/TheHeader\');',
      errors: [errorMustBeRelative],
    },
    {
      name: 'Import from a single slice with an alias',
      filename: '/Users/conarti/Projects/react-course/src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { TheHeader } from \'@/widgets/TheHeader\';',
      errors: [errorMustBeRelative],
    },
    {
      name: 'Import from another layer',
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { useBar } from \'../../../shared/hooks\';',
      errors: [errorMustBeAbsolute],
    },
    {
      name: 'Import from a single slice',
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { useBar } from \'src/widgets/TheHeader/lib\';',
      errors: [errorMustBeRelative],
    },
    {
      name: 'Import from a single layer',
      filename: 'src/app/App.tsx',
      code: 'import { AppRouter } from \'app/providers/router\';',
      errors: [errorMustBeRelative],
    },
    {
      filename: 'src/app/App.tsx',
      code: 'import { Foo } from \'../features/foo\';',
      errors: [errorMustBeAbsolute],
    },
    {
      filename: 'src/shared/ui/AppSelect/AppSelect.tsx',
      code: 'import CheckIcon from \'shared/assets/icons/check.svg\';',
      errors: [errorMustBeRelative],
    },
    {
      filename: 'src/app/foo/bar/ui.tsx',
      code: 'import { Baz } from \'src/app/baz\';',
      errors: [errorMustBeRelative],
    },
    {
      filename: '/Users/conarti/Projects/bp-passport-rf-frontend/src/widgets/payments-widget-wrapper/index.ts',
      code: 'export * from \'@/widgets/payments-widget-wrapper/model\';',
      errors: [errorMustBeRelative],
    },
    {
      filename: '/Users/conarti/Projects/bp-passport-rf-frontend/src/widgets/blocks/MarriageDetails/index.ts',
      code: 'export { MarriageDetails } from \'@/widgets/blocks/MarriageDetails/MarriageDetails\';',
      errors: [errorMustBeRelative],
    },
    {
      name: 'should be invalid if the import is from layer public api (relative import)',
      filename: 'frontend/src/shared/foo/index.ts',
      code: "import { Something } from '../../app';",
      errors: [errorMustBeAbsolute],
    },
  ],
});
