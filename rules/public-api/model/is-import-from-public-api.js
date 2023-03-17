const { segmentsElementsRegExp } = require('../constants');

module.exports.isImportFromPublicApi = (importPath) => {
  const hasSegments = segmentsElementsRegExp.test(importPath);
  return !hasSegments;
};
