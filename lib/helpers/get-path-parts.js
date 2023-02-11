const { srcFolderName, pathSeparator } = require('../constants');

module.exports.getPathParts = (filePath) => {
  const hasSrcPart = filePath.includes(srcFolderName);

  if (hasSrcPart) {
    const [, projectPath] = filePath.split(`${srcFolderName}/`);
    return [layer, slice] = projectPath.split(pathSeparator);
  }

  return [layer, slice] = filePath.split(pathSeparator);
};
