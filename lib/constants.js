module.exports.layers = {
  'shared': 0,
  'entities': 1,
  'features': 2,
  'widgets': 3,
  'pages': 4,
  'app': 5,
};

module.exports.errorMessages = {
  'path-checker': 'There must be relative paths within the same slice',
  'public-api-imports': 'Absolute imports are only allowed from public api (index.ts)',
};

module.exports.pathSeparator = '/';
module.exports.srcFolderName = 'src';
