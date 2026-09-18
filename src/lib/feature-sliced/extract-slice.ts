import type { NormalizedLayerConfig } from '../../config';
import { DEFAULT_SEGMENTS } from '../../config';
import {
  getLayersWithSlices,
  normalizeLayersConfig,
} from './layers-config';
import { relativeToRoot } from './resolution-paths';

export interface SliceResolutionOptions {
  /**
   * The project root. The path is made relative to it, and the candidate directories are
   * probed under it. Without a root nothing is probed and the path heuristic decides alone.
   */
  cwd?: string;
  /** Answers whether an absolute directory holds a public api file */
  hasPublicApi?: (directory: string) => boolean;
}

export interface SliceResolution {
  /** Whether a public api file on disk decided the boundary */
  resolved: boolean;
  /** The answer for this path on its own: the resolved boundary, or the path heuristic */
  slice: string | null;
  /** The path heuristic answer, kept so both sides of a comparison can fall back together */
  fallbackSlice: string | null;
}

const UNRESOLVED: SliceResolution = {
  resolved: false,
  slice: null,
  fallbackSlice: null,
};

/**
 * The slice heuristic the plugin has always used: the path part right before a recognized
 * FSD segment, or the last part after the layer when the path holds no segment.
 */
function extractSliceFromPath(partsAfterLayer: string[], segmentIndex: number, segmentsList: string[]): string | null {
  /* FSD-segment found and there is at least one element before it */
  if (segmentIndex > 0) {
    return partsAfterLayer[segmentIndex - 1];
  }

  /* Edge case: FSD-segment right after layer */
  if (segmentIndex === 0) {
    const remainingParts = partsAfterLayer.slice(1);
    const hasMoreSegments = remainingParts.some((part) =>
      segmentsList.some((seg) => seg.toLowerCase() === part.toLowerCase()),
    );

    /* If no more segments found, this is a bare segment without a slice (e.g., entities/api/queries) */
    if (!hasMoreSegments) {
      return null;
    }

    /* Segment-named group folder (e.g., entities/model/User/ui) */
    return partsAfterLayer[0];
  }

  /* Fallback: no FSD-segment found, take the last segment */
  return partsAfterLayer[partsAfterLayer.length - 1] || null;
}

/**
 * The slice boundary read off the disk: the deepest folder that holds a public api file,
 * among the folders after the layer that lie strictly above the first configured segment.
 *
 * Deepest rather than shallowest, because two folders that each hold a public api file sit in
 * different branches and can therefore never collapse onto one another. The bound is what
 * stops the walk from descending into a segment, which routinely carries a public api of its
 * own and would otherwise be returned as the slice.
 */
function resolveSliceFromDisk(
  partsUpToLayer: string[],
  partsAfterLayer: string[],
  segmentIndex: number,
  cwd: string,
  hasPublicApi: (directory: string) => boolean,
): string | null {
  const boundary = segmentIndex === -1 ? partsAfterLayer.length : segmentIndex;

  /*
   * Deepest first. The candidates are materialised and read from the end rather than walked
   * with a descending index, so no single-operator change to this function can turn it into
   * an unbounded loop.
   */
  const candidates = partsAfterLayer
    .slice(0, boundary)
    .map((part, index) => ({
      part,
      directory: [cwd, ...partsUpToLayer, ...partsAfterLayer.slice(0, index + 1)].join('/'),
    }))
    .reverse();

  const deepest = candidates.find((candidate) => hasPublicApi(candidate.directory));

  return deepest === undefined ? null : deepest.part;
}

/**
 * Extracts the slice from the path, from the filesystem where it can and from the path shape
 * where it cannot.
 *
 * The result says which of the two answered. A caller comparing two paths must never mix the
 * two definitions: when either side is unresolved, both sides use `fallbackSlice`.
 *
 * If layersConfig is not provided, uses default FSD layers.
 * If segmentsConfig is not provided, uses default FSD segments.
 *
 * @example
 * 'entities/User/model' -> 'User'
 * 'entities/group/User/model' -> 'User' (group folder)
 * 'entities/group/User' -> 'User' (fallback)
 */
export function extractSlice(
  targetPath: string,
  layersConfig?: NormalizedLayerConfig[],
  segmentsConfig?: string[],
  resolutionOptions?: SliceResolutionOptions,
): SliceResolution {
  const normalizedLayersConfig = layersConfig ?? normalizeLayersConfig();
  const segmentsList = segmentsConfig ?? [...DEFAULT_SEGMENTS];
  const layersWithSlices = getLayersWithSlices(normalizedLayersConfig);

  const { cwd, hasPublicApi } = resolutionOptions ?? {};

  /*
   * The path is resolved relative to the project root, so a checkout directory that happens
   * to carry a layer name cannot anchor the search, and so the candidate directories can be
   * rebuilt under the root.
   */
  const pathFromRoot = relativeToRoot(targetPath, cwd);

  /* Remove filename (e.g., /index.ts or /model.ts) */
  const pathWithoutFile = (pathFromRoot ?? targetPath).replace(/\/[\w-]+\.\w+$/, '');

  /* Split path into segments */
  const parts = pathWithoutFile.split('/').filter(Boolean);

  /* Find layer index (case-insensitive) */
  const layerIndex = parts.findIndex((part) =>
    layersWithSlices.some((layer) => layer.toLowerCase() === part.toLowerCase()),
  );

  /* If layer not found or nothing after it */
  if (layerIndex === -1 || layerIndex >= parts.length - 1) {
    return UNRESOLVED;
  }

  /* Get path parts after layer */
  const partsAfterLayer = parts.slice(layerIndex + 1);

  /* Find index of first FSD-segment (case-insensitive) */
  const segmentIndex = partsAfterLayer.findIndex((part) =>
    segmentsList.some((seg) => seg.toLowerCase() === part.toLowerCase()),
  );

  const fallbackSlice = extractSliceFromPath(partsAfterLayer, segmentIndex, segmentsList);

  const canProbe = pathFromRoot !== null && cwd !== undefined && hasPublicApi !== undefined;

  const resolvedSlice = canProbe
    ? resolveSliceFromDisk(parts.slice(0, layerIndex + 1), partsAfterLayer, segmentIndex, cwd, hasPublicApi)
    : null;

  if (resolvedSlice === null) {
    return { resolved: false, slice: fallbackSlice, fallbackSlice };
  }

  return { resolved: true, slice: resolvedSlice, fallbackSlice };
}
