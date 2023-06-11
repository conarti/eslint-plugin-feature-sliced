import type { Layer } from '../../config';
import { layers } from '../../config';

/**
 * Checks if layer is known
 */
export function isLayer(layer: unknown): layer is Layer {
  return layers.some((fsdLayer) => fsdLayer === layer);
}

/**
 * Returns layer fsd weight
 */
export function getLayerWeight(layer: unknown): number | null { /* TODO: set 'layer' type to 'Layer', remove guard expression */
  if (!isLayer(layer)) {
    return null;
  }

  return layers.indexOf(layer);
}
