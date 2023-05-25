const {
  convertToAbsolute,
  getLayerSliceFromPath,
  normalizePath,
} = require('../../../lib/helpers');
const { ERROR_MESSAGE_ID } = require('../constants');
const { validate } = require('./validate');

const extractPathsInfo = (node, context) => {
  const normalizedCurrentFilePath = normalizePath(context.getFilename());
  const normalizedImportPath = normalizePath(node.source.value);
  const importAbsolutePath = convertToAbsolute(normalizedCurrentFilePath, normalizedImportPath);
  const [importLayer, importSlice] = getLayerSliceFromPath(importAbsolutePath);
  const [currentFileLayer, currentFileSlice] = getLayerSliceFromPath(normalizedCurrentFilePath);
  const isTypeImportKind = node.importKind === 'type';

  return {
    normalizedImportPath,
    importLayer,
    importSlice,
    currentFileLayer,
    currentFileSlice,
    isTypeImportKind,
  };
};

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
