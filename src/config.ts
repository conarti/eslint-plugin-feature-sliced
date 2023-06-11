export type Layers = ReadonlyArray<
	'shared'
	| 'entities'
	| 'features'
	| 'widgets'
	| 'pages'
	| 'processes'
	| 'app'
>;

export type Layer = Layers[number]

/**
 * Layers arranged in order of their weight in the feature-sliced methodology
 */
export const layers: Layers = [
  'shared',
  'entities',
  'features',
  'widgets',
  'pages',
  'processes',
  'app',
];

export type Segments = ReadonlyArray<
    'ui'
    | 'model'
    | 'lib'
    | 'api'
    | 'config'
    | 'assets'
>;

/**
 * Slice segments regulated by feature-sliced methodologies
 */
export const segments: Segments = [
  'ui',
  'model',
  'lib',
  'api',
  'config',
  'assets',
];

export const pathSeparator = '/';

export const RULE_DOCS_URL = 'https://example.com/rule/';
