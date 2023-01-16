const rule = require('./index');
const { RuleTester } = require('eslint');
const { errorCodes } = require('../../constants');

const aliasOptions = [
  {
    alias: '@',
  },
];

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
          messageId: errorCodes['path-checker'],
        },
      ],
    },
    {
      filename: '/Users/conarti/Projects/react-course/src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      code: 'import { TheHeader } from \'@/widgets/TheHeader\';',
      options: aliasOptions,
      errors: [
        {
          messageId: errorCodes['path-checker'],
        },
      ],
    },
  ],
});
