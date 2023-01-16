/**
 * @fileoverview Feature-sliced design methodology plugin for react
 * @author conarti
 */

const requireIndex = require('requireindex');

// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + '/rules');
