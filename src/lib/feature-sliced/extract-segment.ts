import type { NormalizedLayerConfig } from '../../config';
import { DEFAULT_SEGMENTS } from '../../config';
import {
  getLayersWithSlices,
  normalizeLayersConfig,
} from './layers-config';

type SegmentFiles = string | null;

function createFsdPartsRegExp(layersWithSlices: string[], segmentsList: string[]): RegExp {
  const layersUnion = layersWithSlices.join('|');
  const segmentsUnion = segmentsList.join('|');
  return new RegExp(
    `(?<=(?<layer>${layersUnion}))\\/(?<slice>([\\w-]*\\/)+?)(?<segment>(${segmentsUnion})(\\.\\w+)?)(\\/(?<segmentFiles>.*))?`,
  );
}

/**
 * Extracts segment from the path.
 * If layersConfig is not provided, uses default FSD layers.
 * If segmentsConfig is not provided, uses default FSD segments.
 */
export function extractSegment(
  targetPath: string,
  layersConfig?: NormalizedLayerConfig[],
  segmentsConfig?: string[],
): [string | null, SegmentFiles] {
  const normalizedLayersConfig = layersConfig ?? normalizeLayersConfig();
  const segmentsList = segmentsConfig ?? [...DEFAULT_SEGMENTS];
  const layersWithSlices = getLayersWithSlices(normalizedLayersConfig);
  const fsdPartsRegExp = createFsdPartsRegExp(layersWithSlices, segmentsList);

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

  return [segmentWithoutFileExtension, segmentFiles];
}
