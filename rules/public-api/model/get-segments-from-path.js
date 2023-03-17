const { getByRegExp } = require('../../../lib/helpers');
const { segmentsElementsRegExp } = require('../constants');

module.exports.getSegmentsFromPath = (targetPath) => {
  return getByRegExp(targetPath, segmentsElementsRegExp);
};
