const { joinPath } = require('./join-path');
const { isPathRelative } = require('./is-path-relative');

module.exports.convertToAbsolute = (fromPath, targetPath) => {
  if (targetPath === '') {
    return fromPath;
  }

  if (fromPath === '') {
    return targetPath;
  }

  if (!isPathRelative(targetPath)) {
    return targetPath;
  }

  return joinPath(fromPath, `../${targetPath}`);
};
