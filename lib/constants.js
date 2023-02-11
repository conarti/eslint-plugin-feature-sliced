const layers = {
  'shared': 0,
  'entities': 1,
  'features': 2,
  'widgets': 3,
  'pages': 4,
  'processes': 5,
  'app': 6,
};

const layersNames = Object.keys(layers);

module.exports.layers = layers;

module.exports.layersRegExp = new RegExp(`(${layersNames.join('|')})`);

module.exports.errorCodes = {
  'path-checker': '0',
  'public-api-imports': '0',
  'layer-imports': '0',
};

module.exports.pathSeparator = '/';
