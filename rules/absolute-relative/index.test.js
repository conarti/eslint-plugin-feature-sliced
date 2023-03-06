const rule = require('./index');
const { RuleTester } = require('eslint');
const { ERROR_MESSAGE_ID } = require('./constants');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

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
  ],

  invalid: [
    /**
     * Import from a single slice
     */
    {
      filename: '/Users/conarti/Projects/react-course/src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { TheHeader } from \'widgets/TheHeader\';',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH,
        },
      ],
    },
    /**
     * Import from a single slice with an alias
     */
    {
      filename: '/Users/conarti/Projects/react-course/src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { TheHeader } from \'@/widgets/TheHeader\';',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH,
        },
      ],
    },
    /**
     * Import from another layer
     */
    {
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { useBar } from \'../../../shared/hooks\';',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.MUST_BE_ABSOLUTE_PATH,
        },
      ],
    },
    /**
     * Import from a single slice
     */
    {
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { useBar } from \'src/widgets/TheHeader/lib\';',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH,
        },
      ],
    },
    /**
     * Import from a single layer
     */
    {
      filename: 'src/app/App.tsx',
      code: 'import { AppRouter } from \'app/providers/router\';',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH,
        },
      ],
    },
    {
      filename: 'src/app/App.tsx',
      code: 'import { Foo } from \'../features/foo\';',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.MUST_BE_ABSOLUTE_PATH,
        },
      ],
    },
    {
      filename: 'src/shared/ui/AppSelect/AppSelect.tsx',
      code: 'import CheckIcon from \'shared/assets/icons/check.svg\';',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH,
        },
      ],
    },
    {
      filename: 'src/app/foo/bar/ui.tsx',
      code: 'import { Baz } from \'src/app/baz\';',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH,
        },
      ],
    },
  ],
});
