const path = require('path');

module.exports.convertToAbsolute = (fromPath, targetPath) => {
  if (targetPath === '') {
    return fromPath;
  }

  if (fromPath === '') {
    return targetPath;
  }

  return path.join(path.normalize(fromPath), path.normalize(`../${targetPath}`));
};
