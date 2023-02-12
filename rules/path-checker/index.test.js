const rule = require('./index');
const { RuleTester } = require('eslint');
const { ERROR_MESSAGE_ID } = require('./constants');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

ruleTester.run('path-checker', rule, {
  valid: [
    {
      filename: '/Users/conarti/Projects/react-course/src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { TheHeader } from \'./TheHeader\';',
      errors: [],
    },
  ],

  invalid: [
    {
      filename: '/Users/conarti/Projects/react-course/src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { TheHeader } from \'widgets/TheHeader\';',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH,
        },
      ],
    },
    {
      filename: '/Users/conarti/Projects/react-course/src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { TheHeader } from \'@/widgets/TheHeader\';',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.MUST_BE_RELATIVE_PATH,
        },
      ],
    },
    {
      filename: 'src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { useBar } from \'../../../shared/hooks\';',
      errors: [
        {
          messageId: ERROR_MESSAGE_ID.MUST_BE_ABSOLUTE_PATH,
        },
      ],
    },
  ],
});
