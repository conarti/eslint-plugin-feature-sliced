const { ERROR_MESSAGE_ID } = require('../config');

function reportCanNotImportLayer(context, node, pathsInfo) {
  context.report({
    node: node.source,
    messageId: ERROR_MESSAGE_ID.CAN_NOT_IMPORT,
    data: {
      importLayer: pathsInfo.importLayer,
      currentFileLayer: pathsInfo.currentFileLayer,
    },
  });
}

module.exports = {
  reportCanNotImportLayer,
};
