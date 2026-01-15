import type { NormalizedLayerConfig } from '../../config';
import { segments } from '../../config';
import {
  getLayersWithSlices,
  normalizeLayersConfig,
} from './layers-config';

/**
 * Extracts slice from the path.
 *
 * Heuristic: slice is the last path segment BEFORE an FSD-segment
 * (ui/model/lib/api/config/assets) or file.
 *
 * Fallback: if no FSD-segment found, take the last segment after layer.
 *
 * If config is not provided, uses default FSD layers.
 *
 * @example
 * 'entities/User/model' -> 'User'
 * 'entities/group/User/model' -> 'User' (group folder)
 * 'entities/group/User' -> 'User' (fallback)
 */
export function extractSlice(
  targetPath: string,
  config?: NormalizedLayerConfig[],
): string | null {
  const layersConfig = config ?? normalizeLayersConfig();
  const layersWithSlices = getLayersWithSlices(layersConfig);

  /* Remove filename (e.g., /index.ts or /model.ts) */
  const pathWithoutFile = targetPath.replace(/\/[\w-]+\.\w+$/, '');

  /* Split path into segments */
  const parts = pathWithoutFile.split('/').filter(Boolean);

  /* Find layer index (case-insensitive) */
  const layerIndex = parts.findIndex((part) =>
    layersWithSlices.some((layer) => layer.toLowerCase() === part.toLowerCase()),
  );

  /* If layer not found or nothing after it */
  if (layerIndex === -1 || layerIndex >= parts.length - 1) {
    return null;
  }

  /* Get path parts after layer */
  const partsAfterLayer = parts.slice(layerIndex + 1);

  /* Find index of first FSD-segment (case-insensitive) */
  const segmentIndex = partsAfterLayer.findIndex((part) =>
    segments.some((seg) => seg.toLowerCase() === part.toLowerCase()),
  );

  /* If FSD-segment found and there's at least one element before it */
  if (segmentIndex > 0) {
    return partsAfterLayer[segmentIndex - 1];
  }

  /* Edge case: FSD-segment right after layer (e.g., entities/model/User/ui) */
  if (segmentIndex === 0) {
    return partsAfterLayer[0];
  }

  /* Fallback: no FSD-segment found, take the last segment */
  return partsAfterLayer[partsAfterLayer.length - 1] || null;
}
