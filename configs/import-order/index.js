const recommended = require('./recommended');
const withNewlines = require('./with-newlines');
const withNewlinesAndTypeGroup = require('./with-newlines-and-type-group');
const withTypeGroup = require('./with-type-group');

module.exports = {
  parserOptions: {
    'ecmaVersion': '2015',
    'sourceType': 'module',
  },
  configs: {
    'recommended': recommended,
    'with-newlines': withNewlines,
    'with-type-group': withTypeGroup,
    'with-newlines-and-type-group': withNewlinesAndTypeGroup,
  },
};
