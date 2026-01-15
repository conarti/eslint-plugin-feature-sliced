import type { Linter } from 'eslint';

export const PLUGIN_NAME = '@conarti/feature-sliced' as const;

/**
 * Rule names for the feature-sliced plugin
 */
export const RULE_NAMES = {
  LAYERS_SLICES: `${PLUGIN_NAME}/layers-slices`,
  ABSOLUTE_RELATIVE: `${PLUGIN_NAME}/absolute-relative`,
  PUBLIC_API: `${PLUGIN_NAME}/public-api`,
  IMPORT_ORDER: `${PLUGIN_NAME}/import-order`,
} as const;

export type Layers = ReadonlyArray<
  'shared'
  | 'entities'
  | 'features'
  | 'widgets'
  | 'pages'
  | 'processes'
  | 'app'
>;

export type Layer = Layers[number];

/**
 * Layers arranged in order of their weight in the feature-sliced methodology
 * @deprecated Use normalizeLayersConfig() from layers-config.ts for custom layers support
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

/**
 * Layers where no slices exist. This affects the behavior of some rules.
 * For example, if there are no slices in a layer, then imports should always be relative between the modules of this layer,
 * and the layers-slices rule will ignore the cross-import rule for layers with slices ("you cannot import a slice into a slice")
 * @deprecated Use getLayersWithoutSlices() from layers-config.ts for custom layers support
 */
export const layersWithoutSlices: Layer[] = [
  'shared',
  'app',
];

/**
 * Layers that can contain slices by feature-sliced methodology
 * @deprecated Use getLayersWithSlices() from layers-config.ts for custom layers support
 */
export const layersWithSlices: Layer[] = layers.filter((layer) => !layersWithoutSlices.includes(layer));

/* === Layer Customization Types === */

/**
 * Object configuration for a layer
 */
export interface LayerObjectConfig {
  /** Layer name */
  name: string;
  /** Whether the layer can contain slices. Default: true */
  hasSlices?: boolean;
}

/**
 * Layer configuration item: string (hasSlices: true) or object for customization
 */
export type LayerConfigItem = string | LayerObjectConfig;

/**
 * Array of layer configurations
 */
export type LayersConfig = LayerConfigItem[];

/**
 * Normalized layer configuration (after processing defaults)
 */
export interface NormalizedLayerConfig {
  name: string;
  hasSlices: boolean;
}

/**
 * Default FSD layers configuration
 */
export const DEFAULT_LAYERS_CONFIG: LayersConfig = [
  { name: 'shared', hasSlices: false },
  'entities',
  'features',
  'widgets',
  'pages',
  'processes',
  { name: 'app', hasSlices: false },
];

export type Segments = ReadonlyArray<
  'ui'
  | 'model'
  | 'lib'
  | 'api'
  | 'config'
  | 'assets'
>;

export type Segment = Segments[number];

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

export type TypedFlatConfigItem = Omit<Linter.Config<Linter.RulesRecord>, 'plugins'> & {
  // Relax plugins type limitation, as most of the plugins did not have correct type info yet.
  /**
   * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>;
};

export type ImportOrderConfigName = 'recommended' | 'with-newlines' | 'with-newlines-and-type-group' | 'with-type-group';
