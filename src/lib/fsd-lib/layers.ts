import {
  type Layer,
  layers,
  layersWithoutSlices,
} from '../../config';

/**
 * Checks if layer is known
 */
export function isLayer(layer: unknown): layer is Layer {
  return layers.some((fsdLayer) => fsdLayer === layer);
}

/**
 * Returns layer fsd weight
 */
export function getLayerWeight(layer: Layer): number {
  return layers.indexOf(layer);
}

export function canLayerContainSlices(layer: Layer): boolean {
  return !layersWithoutSlices.includes(layer);
}
