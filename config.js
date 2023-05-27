/**
 * Layers arranged in order of their weight in the feature-sliced methodology
 * @type {[
 *   'shared',
 *   'entities',
 *   'features',
 *   'widgets',
 *   'pages',
 *   'processes',
 *   'app',
 * ]}
 */
const layers = [
  'shared',
  'entities',
  'features',
  'widgets',
  'pages',
  'processes',
  'app',
];

/**
 * Slice segments regulated by feature-sliced methodologies
 * @type {[
 *   'ui',
 *   'model',
 *   'lib',
 *   'api',
 *   'config',
 *   'assets',
 * ]}
 */
const segments = [
  'ui',
  'model',
  'lib',
  'api',
  'config',
  'assets',
];

module.exports = {
  pathSeparator: '/',
  layers,
  segments,
};
