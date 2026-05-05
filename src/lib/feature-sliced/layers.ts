import type { NormalizedLayerConfig } from '../../config';
import {
  canLayerContainSlices as canContainSlicesWithConfig,
  getLayerWeight as getWeightWithConfig,
  isKnownLayer,
  normalizeLayersConfig,
} from './layers-config';

/**
 * Checks if layer is known.
 * If config is not provided, uses default FSD layers.
 */
export function isLayer(layer: unknown, config?: NormalizedLayerConfig[]): boolean {
  const layersConfig = config ?? normalizeLayersConfig();
  return isKnownLayer(layer, layersConfig);
}

/**
 * Returns layer fsd weight.
 * If config is not provided, uses default FSD layers.
 */
export function getLayerWeight(layer: string, config?: NormalizedLayerConfig[]): number {
  const layersConfig = config ?? normalizeLayersConfig();
  return getWeightWithConfig(layer, layersConfig);
}

/**
 * Checks if layer can contain slices.
 * If config is not provided, uses default FSD layers.
 */
export function canLayerContainSlices(layer: string, config?: NormalizedLayerConfig[]): boolean {
  const layersConfig = config ?? normalizeLayersConfig();
  return canContainSlicesWithConfig(layer, layersConfig);
}
