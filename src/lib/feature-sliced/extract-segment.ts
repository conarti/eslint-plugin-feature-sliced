import type { NormalizedLayerConfig } from '../../config';
import type { SliceBoundary } from './extract-slice';
import { DEFAULT_SEGMENTS } from '../../config';
import {
  getLayersWithSlices,
  normalizeLayersConfig,
} from './layers-config';
import { relativeToRoot } from './resolution-paths';

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
 *
 * The boundary is used as the position it is. Looking the slice up by name instead would stop
 * at the first part carrying that name, which is the wrong folder for a slice that holds a
 * folder of its own name.
 */
function extractSegmentAtBoundary(
  targetPath: string,
  layersWithSlices: string[],
  boundary: SliceBoundary,
): [string | null, SegmentFiles] {
  const parts = targetPath.split('/').filter(Boolean);

  const layerIndex = parts.findIndex((part) =>
    layersWithSlices.some((layer) => layer.toLowerCase() === part.toLowerCase()),
  );

  if (layerIndex === -1) {
    return [null, null];
  }

  const partsAfterLayer = parts.slice(layerIndex + 1);

  /* The boundary counts from the layer, so it describes no path anchored on a different one */
  if (partsAfterLayer[boundary.index]?.toLowerCase() !== boundary.slice.toLowerCase()) {
    return [null, null];
  }

  const segmentPart = partsAfterLayer[boundary.index + 1];

  if (segmentPart === undefined) {
    return [null, null];
  }

  /* The slice public api and the cross-import folder sit where a segment sits and are not one */
  if (SLICE_ENTRY_REGEXP.test(segmentPart) || segmentPart.toLowerCase() === CROSS_IMPORT_DIR) {
    return [null, null];
  }

  const segmentFiles = partsAfterLayer.slice(boundary.index + 2).join('/');

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
 *
 * Both routes begin by looking for the layer, so both look for it below the project root.
 * Nothing forbids holding a checkout in a folder named after a layer, and a search that
 * starts at the top of an absolute path stops at that folder: the positional route then
 * counts the boundary from one branch too high, and the name list route reads the folders
 * between the two as the slice. A path that lies under no root is read as written, which is
 * what an aliased or a bare target is.
 */
export function extractSegment(
  targetPath: string,
  layersConfig?: NormalizedLayerConfig[],
  segmentsConfig?: string[],
  boundary?: SliceBoundary | null,
  root?: string,
): [string | null, SegmentFiles] {
  const normalizedLayersConfig = layersConfig ?? normalizeLayersConfig();
  const segmentsList = segmentsConfig ?? [...DEFAULT_SEGMENTS];
  const layersWithSlices = getLayersWithSlices(normalizedLayersConfig);

  const pathFromRoot = relativeToRoot(targetPath, root) ?? targetPath;

  if (boundary !== undefined && boundary !== null) {
    return extractSegmentAtBoundary(pathFromRoot, layersWithSlices, boundary);
  }

  const fsdPartsRegExp = createFsdPartsRegExp(layersWithSlices, segmentsList);

  const fsdParts = pathFromRoot.match(fsdPartsRegExp);

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
