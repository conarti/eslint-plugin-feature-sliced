import antfu from '@antfu/eslint-config';

export default antfu({
  type: 'lib',
  stylistic: {
    semi: true,
  },
  gitignore: true,
  ignores: ['**/*.md'],
}, {
  rules: {
    'style/quotes': ['error', 'single', { avoidEscape: true }],
    'style/arrow-parens': ['error', 'always'],
    'ts/explicit-function-return-type': 'off',
  },
});
