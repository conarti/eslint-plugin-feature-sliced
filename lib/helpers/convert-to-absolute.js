const { joinPath } = require("./join-path");

module.exports.convertToAbsolute = (fromPath, targetPath) => {
  if (targetPath === '') {
    return fromPath;
  }

  if (fromPath === '') {
    return targetPath;
  }

  return joinPath(fromPath, `../${targetPath}`);
};
