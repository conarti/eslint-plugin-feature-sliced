const {
  isIgnored,
  extractRuleOptions,
} = require('../../../lib/helpers');
const { ERROR_MESSAGE_ID } = require('../constants');
const { extractPathsInfo } = require('./extract-paths-info');
const { canImportLayer } = require('./can-import-layer');

function reportLayerError(context, node, pathsInfo) {
  context.report({
    node: node.source,
    messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
    data: {
      importLayer: pathsInfo.importLayer,
      currentFileLayer: pathsInfo.currentFileLayer,
    },
  });
}

module.exports.validateAndReport = function (node, context) {
  const pathsInfo = extractPathsInfo(node, context);
  const userDefinedRuleOptions = extractRuleOptions(context);

  if (isIgnored(pathsInfo.importPath, userDefinedRuleOptions.ignorePatterns)) {
    return;
  }

  if (!canImportLayer(pathsInfo, userDefinedRuleOptions)) {
    reportLayerError(context, node, pathsInfo);
  }
};
