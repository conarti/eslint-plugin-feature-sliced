const { ERROR_MESSAGE_ID } = require('../constants');
const { validate } = require('./validate');
const { extractPathsInfo } = require('./extract-paths-info');
const { isValidByRuleOptions } = require('./is-valid-by-rule-options');

module.exports.validateAndReport = function(node, context, ruleOptions) {
  const pathsInfo = extractPathsInfo(node, context);

  if (isValidByRuleOptions(pathsInfo, ruleOptions)) {
    return;
  }

  if (validate(pathsInfo)) {
    return;
  }

  context.report({
    node: node.source,
    messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
    data: {
      importLayer: pathsInfo.importLayer,
      currentFileLayer: pathsInfo.currentFileLayer,
    },
  });
};
