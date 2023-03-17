const { segmentsElementsRegExp } = require('../constants');

module.exports.convertToPublicApi = (targetPath) => {
  const publicApiPath = targetPath.replace(segmentsElementsRegExp, '');
  const publicApiPathWithoutSeparatorAtTheEnd = publicApiPath.replace(/\/$/, '');
  return publicApiPathWithoutSeparatorAtTheEnd;
};
