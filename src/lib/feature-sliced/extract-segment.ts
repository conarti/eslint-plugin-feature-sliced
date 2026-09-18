import type { NormalizedLayerConfig } from '../../config';
import { DEFAULT_SEGMENTS } from '../../config';
import {
  getLayersWithSlices,
  normalizeLayersConfig,
} from './layers-config';

type SegmentFiles = string | null;

/**
 * The cross-import public api folder of a slice, which is not one of its segments
 */
const CROSS_IMPORT_DIR = '@x';

/**
 * A slice public api entry: `index`, `index.ts`, `index.module.css` and so on. It sits where
 * a segment sits and is not one.
 */
const SLICE_ENTRY_REGEXP = /^index(?:\.\w+)*$/i;

const FILE_EXTENSION_REGEXP = /\.[^/.]+$/;

/**
 * Derives the segment from the slice boundary the filesystem resolved: the segment is the
 * first path part after the slice, whatever it is called, and the segment files are whatever
 * follows it. The configured name list stops deciding what a segment is.
 */
function extractSegmentAfterSlice(
  targetPath: string,
  layersWithSlices: string[],
  slice: string,
): [string | null, SegmentFiles] {
  const parts = targetPath.split('/').filter(Boolean);

  const layerIndex = parts.findIndex((part) =>
    layersWithSlices.some((layer) => layer.toLowerCase() === part.toLowerCase()),
  );

  if (layerIndex === -1) {
    return [null, null];
  }

  const partsAfterLayer = parts.slice(layerIndex + 1);
  const sliceIndex = partsAfterLayer.findIndex((part) => part.toLowerCase() === slice.toLowerCase());

  if (sliceIndex === -1) {
    return [null, null];
  }

  const segmentPart = partsAfterLayer[sliceIndex + 1];

  if (segmentPart === undefined) {
    return [null, null];
  }

  /* The slice public api and the cross-import folder sit where a segment sits and are not one */
  if (SLICE_ENTRY_REGEXP.test(segmentPart) || segmentPart.toLowerCase() === CROSS_IMPORT_DIR) {
    return [null, null];
  }

  const segmentFiles = partsAfterLayer.slice(sliceIndex + 2).join('/');

  return [segmentPart.replace(FILE_EXTENSION_REGEXP, ''), segmentFiles || null];
}

function createFsdPartsRegExp(layersWithSlices: string[], segmentsList: string[]): RegExp {
  const layersUnion = layersWithSlices.join('|');
  const segmentsUnion = segmentsList.join('|');
  return new RegExp(
    `(?<=(?<layer>${layersUnion}))\\/(?<slice>([\\w-]*\\/)+?)(?<segment>(${segmentsUnion})(\\.\\w+)?)(\\/(?<segmentFiles>.*))?`,
  );
}

/**
 * Extracts segment from the path.
 *
 * With a slice boundary resolved from the filesystem the segment is positional: the first path
 * part after the slice. Without one the configured name list decides, which is what the plugin
 * has always done and what every path the filesystem cannot answer keeps doing.
 *
 * If layersConfig is not provided, uses default FSD layers.
 * If segmentsConfig is not provided, uses default FSD segments.
 */
export function extractSegment(
  targetPath: string,
  layersConfig?: NormalizedLayerConfig[],
  segmentsConfig?: string[],
  resolvedSlice?: string | null,
): [string | null, SegmentFiles] {
  const normalizedLayersConfig = layersConfig ?? normalizeLayersConfig();
  const segmentsList = segmentsConfig ?? [...DEFAULT_SEGMENTS];
  const layersWithSlices = getLayersWithSlices(normalizedLayersConfig);

  if (resolvedSlice !== undefined && resolvedSlice !== null) {
    return extractSegmentAfterSlice(targetPath, layersWithSlices, resolvedSlice);
  }

  const fsdPartsRegExp = createFsdPartsRegExp(layersWithSlices, segmentsList);

  const fsdParts = targetPath.match(fsdPartsRegExp);

  if (fsdParts === null) {
    return [null, null];
  }

  const {
    segment = null,
    segmentFiles = null,
  } = fsdParts.groups || {};

  const segmentWithoutFileExtension = segment?.replace(FILE_EXTENSION_REGEXP, '') || null;

  return [segmentWithoutFileExtension, segmentFiles];
}
