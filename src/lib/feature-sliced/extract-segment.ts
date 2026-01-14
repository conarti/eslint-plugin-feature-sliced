import type { NormalizedLayerConfig, Segment } from '../../config';
import { segments } from '../../config';
import {
  getLayersWithSlices,
  normalizeLayersConfig,
} from './layers-config';

type SegmentFiles = string | null;

function createFsdPartsRegExp(layersWithSlices: string[]): RegExp {
  const layersUnion = layersWithSlices.join('|');
  const segmentsUnion = segments.join('|');
  return new RegExp(
    `(?<=(?<layer>${layersUnion}))\\/(?<slice>([\\w-]*\\/)+?)(?<segment>(${segmentsUnion})(\\.\\w+)?)(\\/(?<segmentFiles>.*))?`,
  );
}

/**
 * Extracts segment from the path.
 * If config is not provided, uses default FSD layers.
 */
export function extractSegment(
  targetPath: string,
  config?: NormalizedLayerConfig[],
): [Segment | null, SegmentFiles] {
  const layersConfig = config ?? normalizeLayersConfig();
  const layersWithSlices = getLayersWithSlices(layersConfig);
  const fsdPartsRegExp = createFsdPartsRegExp(layersWithSlices);

  const fsdParts = targetPath.match(fsdPartsRegExp);

  if (fsdParts === null) {
    return [null, null];
  }

  const {
    segment = null,
    segmentFiles = null,
  } = fsdParts.groups || {};

  const fileExtensionRegExp = /\.[^/.]+$/;
  const segmentWithoutFileExtension = segment?.replace(fileExtensionRegExp, '') || null;

  return [segmentWithoutFileExtension as Segment | null, segmentFiles];
}
