const importOrder = require('./configs/import-order');
const importOrderWithNewlines = require('./configs/import-order/with-newlines');
const importOrderWithNewlinesAndTypeGroup = require('./configs/import-order/with-newlines-and-type-group');
const importOrderWithTypeGroup = require('./configs/import-order/with-type-group');

module.exports = {
  parserOptions: {
    'ecmaVersion': '2015',
    'sourceType': 'module',
  },
  configs: {
    'recommended': importOrder,
    'with-newlines': importOrderWithNewlines,
    'with-type-group': importOrderWithTypeGroup,
    'with-newlines-and-type-group': importOrderWithNewlinesAndTypeGroup,
  },
};
