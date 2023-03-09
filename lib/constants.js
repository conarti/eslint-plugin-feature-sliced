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

/**
 * Collection of layers with their import weight
 * @type {Map<'app' | 'shared' | 'features' | 'processes' | 'pages' | 'entities' | 'widgets', number>}
 */
module.exports.layersMap = new Map(Object.entries(layers));

module.exports.layersNames = layersNames;

module.exports.pathSeparator = '/';
