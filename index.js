/**
 * @fileoverview Feature-sliced design methodology plugin for react
 * @author conarti
 */

const requireIndex = require('requireindex');
const recommended = require('./configs/recommended');

module.exports = {
  parserOptions: {
    'ecmaVersion': '2015',
    'sourceType': 'module',
  },
  rules: requireIndex(__dirname + '/rules'), // import all rules in lib/rules
  configs: {
    recommended,
  },
};
