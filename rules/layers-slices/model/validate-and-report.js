const { ERROR_MESSAGE_ID } = require('../constants');
const { extractPathsInfo } = require('./extract-paths-info');
const { needToSkipValidation } = require('./need-to-skip-validation');
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

module.exports.validateAndReport = function (node, context, ruleOptions) {
  const pathsInfo = extractPathsInfo(node, context);

  if (needToSkipValidation(pathsInfo, ruleOptions)) {
    return;
  }

  if (!canImportLayer(pathsInfo, ruleOptions)) {
    reportLayerError(context, node, pathsInfo);
  }
};
