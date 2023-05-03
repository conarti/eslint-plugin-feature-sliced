const rule = require('./index');
const { RuleTester } = require('eslint');
const { ERROR_MESSAGE_ID } = require('./constants');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  parser: require.resolve('@typescript-eslint/parser'),
});

/**
 * @param mustBe {'absolute'|'relative'}
 * @returns {{messageId: string}}
 */
const makeError = (mustBe) => {
  if (mustBe === 'absolute') {
    return ({
      messageId: ERROR_MESSAGE_ID.MUST_BE_ABSOLUTE_PATH,
    });
  }

  if (mustBe === 'relative') {
    return ({
      messageId: ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH,
    });
  }
};


const makeIgnoreInFilesOptions = (patterns) => [
  {
    ignoreInFilesPatterns: patterns,
  },
];

ruleTester.run('absolute-relative', rule, {
  valid: [
    {
      filename: '/Users/conarti/Projects/react-course/src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { TheHeader } from \'./TheHeader\';',
    },
    {
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { useBar } from \'src/shared/hooks\';',
    },
    {
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { useBar } from \'../../lib\';',
    },
    {
      filename: 'src/app/App.tsx',
      code: 'import { AppRouter } from \'./providers/router\';',
    },
    {
      filename: 'src/app/App.tsx',
      code: 'import { Foo } from \'widgets/foo\';',
    },
    {
      filename: 'src/pages/passport-info-case-edit/lib/index.ts',
      code: 'import generatePayloadMapper from \'./generatePayloadMapper\';',
    },
    {
      filename: '/Users/conarti/Projects/bp-passport-rf-frontend/src/widgets/payments-widget-wrapper/index.ts',
      code: 'export * from \'./model\';',
    },
    {
      filename: '/Users/conarti/Projects/bp-passport-rf-frontend/src/components/blocks/MarriageDetails/index.ts',
      code: 'export { MarriageDetails } from \'./MarriageDetails\';',
    },
    {
      /* should be valid if it has ignored in files options */
      filename: '/Users/conarti/Projects/frontend/src/shared/foo/index.ts',
      code: 'import { BAR } from \'@/shared/bar\';',
      options: makeIgnoreInFilesOptions(['**/*/shared/foo/**/*']),
    },
    {
      // FIXME: should works without extra options
      /* should be valid if it has slice with 'layer' name */
      filename: '/Users/conarti/Projects/frontend/src/processes/shared/index.ts',
      code: 'import { BAR } from \'@/shared/constants\';',
      options: makeIgnoreInFilesOptions(['**/*/processes/shared/**/*']),
    },
  ],

  invalid: [
    /**
     * Import from a single slice
     */
    {
      filename: '/Users/conarti/Projects/react-course/src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { TheHeader } from \'widgets/TheHeader\';',
      errors: [makeError('relative') ],
    },
    /**
     * Import from a single slice and import expression
     */
    {
      filename: '/Users/conarti/Projects/react-course/src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'const TheHeader = () => import(\'widgets/TheHeader\');',
      errors: [makeError('relative') ],
    },
    /**
     * Import from a single slice with an alias
     */
    {
      filename: '/Users/conarti/Projects/react-course/src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { TheHeader } from \'@/widgets/TheHeader\';',
      errors: [makeError('relative')],
    },
    /**
     * Import from another layer
     */
    {
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { useBar } from \'../../../shared/hooks\';',
      errors: [makeError('absolute')],
    },
    /**
     * Import from a single slice
     */
    {
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { useBar } from \'src/widgets/TheHeader/lib\';',
      errors: [makeError('relative')],
    },
    /**
     * Import from a single layer
     */
    {
      filename: 'src/app/App.tsx',
      code: 'import { AppRouter } from \'app/providers/router\';',
      errors: [makeError('relative')],
    },
    {
      filename: 'src/app/App.tsx',
      code: 'import { Foo } from \'../features/foo\';',
      errors: [makeError('absolute')],
    },
    {
      filename: 'src/shared/ui/AppSelect/AppSelect.tsx',
      code: 'import CheckIcon from \'shared/assets/icons/check.svg\';',
      errors: [makeError('relative')],
    },
    {
      filename: 'src/app/foo/bar/ui.tsx',
      code: 'import { Baz } from \'src/app/baz\';',
      errors: [makeError('relative')],
    },
    {
      filename: '/Users/conarti/Projects/bp-passport-rf-frontend/src/widgets/payments-widget-wrapper/index.ts',
      code: 'export * from \'@/widgets/payments-widget-wrapper/model\';',
      errors: [makeError('relative')],
    },

    {
      filename: '/Users/conarti/Projects/bp-passport-rf-frontend/src/widgets/blocks/MarriageDetails/index.ts',
      code: 'export { MarriageDetails } from \'@/widgets/blocks/MarriageDetails/MarriageDetails\';',
      errors: [makeError('relative')],
    },
  ],
});
