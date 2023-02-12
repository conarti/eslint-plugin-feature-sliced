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
 * @deprecated
 * @type {{app: number, shared: number, features: number, processes: number, pages: number, entities: number, widgets: number}}
 */
module.exports.layers = layers;

/**
 * Collection of layers with their import weight
 * @type {Map<'app' | 'shared' | 'features' | 'processes' | 'pages' | 'entities' | 'widgets', number>}
 */
module.exports.layersMap = new Map(Object.entries(layers));

/**
 * @deprecated
 * @type {RegExp}
 */
module.exports.layersRegExp = new RegExp(`(${layersNames.join('|')})`);
module.exports.layersNames = layersNames;

module.exports.pathSeparator = '/';
