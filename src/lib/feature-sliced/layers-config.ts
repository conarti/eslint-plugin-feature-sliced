import type {
  LayerConfigItem,
  LayersConfig,
  NormalizedLayerConfig,
} from '../../config';
import { DEFAULT_LAYERS_CONFIG } from '../../config';

/**
 * Normalizes a single layer config item to NormalizedLayerConfig
 */
function normalizeLayerConfigItem(item: LayerConfigItem): NormalizedLayerConfig {
  if (typeof item === 'string') {
    return {
      name: item.toLowerCase(),
      hasSlices: true,
      allowSliceCrossImports: false,
    };
  }

  return {
    name: item.name.toLowerCase(),
    hasSlices: item.hasSlices ?? true,
    allowSliceCrossImports: item.allowSliceCrossImports ?? false,
  };
}

/**
 * Normalizes layers configuration, applying defaults.
 * If no config provided, returns normalized DEFAULT_LAYERS_CONFIG.
 */
export function normalizeLayersConfig(config?: LayersConfig): NormalizedLayerConfig[] {
  const layersConfig = config ?? DEFAULT_LAYERS_CONFIG;
  return layersConfig.map(normalizeLayerConfigItem);
}

/**
 * Extracts layer names from normalized config
 */
export function getLayerNames(config: NormalizedLayerConfig[]): string[] {
  return config.map((layer) => layer.name);
}

/**
 * Returns layers that can contain slices
 */
export function getLayersWithSlices(config: NormalizedLayerConfig[]): string[] {
  return config.filter((layer) => layer.hasSlices).map((layer) => layer.name);
}

/**
 * Returns layers that cannot contain slices
 */
export function getLayersWithoutSlices(config: NormalizedLayerConfig[]): string[] {
  return config.filter((layer) => !layer.hasSlices).map((layer) => layer.name);
}

/**
 * Checks if the given string is a known layer
 */
export function isKnownLayer(layer: unknown, config: NormalizedLayerConfig[]): boolean {
  if (typeof layer !== 'string') {
    return false;
  }

  const layerNames = getLayerNames(config);
  return layerNames.includes(layer.toLowerCase());
}

/**
 * Returns the weight (position) of a layer in the hierarchy.
 * Lower weight = lower in the hierarchy (shared has weight 0).
 * Returns -1 if layer is not found.
 */
export function getLayerWeight(layer: string, config: NormalizedLayerConfig[]): number {
  const layerNames = getLayerNames(config);
  return layerNames.indexOf(layer.toLowerCase());
}

/**
 * Checks if the layer can contain slices.
 * Returns false if layer is not found.
 */
export function canLayerContainSlices(layer: string, config: NormalizedLayerConfig[]): boolean {
  const layerConfig = config.find((l) => l.name === layer.toLowerCase());
  return layerConfig?.hasSlices ?? false;
}

/**
 * Checks if the layer allows cross-imports between its slices.
 * Returns false if layer is not found.
 */
export function canLayerAllowSliceCrossImports(layer: string, config: NormalizedLayerConfig[]): boolean {
  const layerConfig = config.find((l) => l.name === layer.toLowerCase());
  return layerConfig?.allowSliceCrossImports ?? false;
}
