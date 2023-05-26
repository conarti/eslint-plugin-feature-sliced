const { ERROR_MESSAGE_ID } = require('../constants');
const { extractPathsInfo } = require('./extract-paths-info');
const { isValidByRuleOptions } = require('./is-valid-by-rule-options');
const { canImportLayer } = require('./can-import-layer');

module.exports.validateAndReport = function (node, context, ruleOptions) {
  const pathsInfo = extractPathsInfo(node, context);

  if (isValidByRuleOptions(pathsInfo, ruleOptions)) {
    return;
  }

  if (!canImportLayer(pathsInfo)) {
    context.report({
      node: node.source,
      messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
      data: {
        importLayer: pathsInfo.importLayer,
        currentFileLayer: pathsInfo.currentFileLayer,
      },
    });
  }
};
