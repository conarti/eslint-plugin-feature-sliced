/**
 * @fileoverview Feature-sliced design methodology plugin for react
 * @author conarti
 */

const path = require('path');
const requireIndex = require('requireindex');

module.exports = {
  parserOptions: {
    'ecmaVersion': '2015',
    'sourceType': 'module',
  },
  rules: requireIndex(__dirname + '/rules'), // import all rules in lib/rules
  extends: [
    path.resolve(__dirname, './rules/import-order'),
  ],
};
