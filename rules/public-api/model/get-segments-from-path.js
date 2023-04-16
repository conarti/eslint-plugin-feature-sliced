const { getByRegExp } = require('../../../lib/helpers');
const { segmentsElementsRegExp } = require('../constants');

/**
 * @deprecated регулярное выражение теперь возвращает все группы. Эта функция не отрабатывает правильно.
 */
module.exports.getSegmentsFromPath = (targetPath) => {
  return getByRegExp(targetPath, segmentsElementsRegExp);
};
