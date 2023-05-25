const { ERROR_MESSAGE_ID } = require('../constants');
const { validate } = require('./validate');
const { extractPathsInfo } = require('./extract-paths-info');

module.exports.validateAndReport = function(node, context, ruleOptions) {
  const pathsInfo = extractPathsInfo(node, context);

  if (validate(pathsInfo, ruleOptions)) {
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
