const { srcFolderName, pathSeparator } = require('../constants');

/**
 * Returns the layer and slice from the path
 * @param filePath {string}
 * @returns {['shared' | 'entities' | 'features' | 'widgets' | 'pages' | 'processes' | 'app', string]} Tuple where the first element is a layer, the second is a slice
 */
module.exports.getPathParts = (filePath) => {
  const hasSrcPart = filePath.includes(srcFolderName);

  if (hasSrcPart) {
    const [, projectPath] = filePath.split(`${srcFolderName}/`);
    return [layer, slice] = projectPath.split(pathSeparator);
  }

  return [layer, slice] = filePath.split(pathSeparator);
};
