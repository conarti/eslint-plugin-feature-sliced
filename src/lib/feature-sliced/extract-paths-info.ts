import type { NormalizedLayerConfig } from '../../config';
import {
  extractPaths,
  type ImportExportNodesWithSourceValue,
  type UnknownRuleContext,
} from '../rule';
import {
  type ExtractedFeatureSlicedParts,
  extractFeatureSlicedParts,
  withFallbackSlice,
} from './extract-feature-sliced-parts';
import { hasPublicApi } from './has-public-api';
import { rerootTargetPath } from './resolution-paths';
import {
  type ValidatedFeatureSlicedParts,
  validateExtractedFeatureSlicedParts,
} from './validate-extracted-feature-sliced-parts';

interface FSPartsToCompare {
  target: {
    validatedFeatureSlicedParts: ValidatedFeatureSlicedParts;
    fsdParts: ExtractedFeatureSlicedParts;
  };
  currentFile: {
    validatedFeatureSlicedParts: ValidatedFeatureSlicedParts;
    fsdParts: ExtractedFeatureSlicedParts;
  };
}

function compareFeatureSlicedParts(fsPartsToCompare: FSPartsToCompare) {
  const {
    target,
    currentFile,
  } = fsPartsToCompare;

  const hasUnknownLayers = target.validatedFeatureSlicedParts.hasNotLayer || currentFile.validatedFeatureSlicedParts.hasNotLayer;
  const isSameLayer = target.validatedFeatureSlicedParts.hasLayer
    && currentFile.validatedFeatureSlicedParts.hasLayer
    && target.fsdParts.layer === currentFile.fsdParts.layer;
  const isSameSlice = isSameLayer
    && ((target.validatedFeatureSlicedParts.hasSlice && currentFile.validatedFeatureSlicedParts.hasSlice
      && target.fsdParts.slice === currentFile.fsdParts.slice)
      || (target.validatedFeatureSlicedParts.hasNotSlice && currentFile.validatedFeatureSlicedParts.hasNotSlice));
  const isSameSegment = target.fsdParts.segment === currentFile.fsdParts.segment;
  /**
   * Whether the import/export file and the current file are inside the same layer that cannot contain slices
   */
  const isSameLayerWithoutSlices = isSameLayer
    && !target.validatedFeatureSlicedParts.canLayerContainSlices
    && !currentFile.validatedFeatureSlicedParts.canLayerContainSlices;

  return {
    hasUnknownLayers,
    isSameLayer,
    isSameSlice,
    isSameSegment,
    isSameLayerWithoutSlices,
  };
}

interface ExtractPathsInfoOptions {
  layersConfig?: NormalizedLayerConfig[];
  segmentsConfig?: string[];
}

/**
 * Extracts paths info including FSD parts.
 * If layersConfig is not provided, uses default FSD layers.
 * If segmentsConfig is not provided, uses default FSD segments.
 */
export function extractPathsInfo(
  node: ImportExportNodesWithSourceValue,
  context: UnknownRuleContext,
  options?: ExtractPathsInfoOptions,
) {
  const { layersConfig, segmentsConfig } = options ?? {};

  const {
    targetPath,
    normalizedTargetPath,
    normalizedCurrentFilePath,
    absoluteTargetPath,
    normalizedCwd,
  } = extractPaths(node, context);

  /*
   * Only a relative specifier reaches the rules as a real path, so the target is rebuilt under
   * the current file's layer root before the slice boundary is looked for on disk. Without it
   * every aliased import would fail the probe and the resolution would do nothing at all.
   */
  const slicePathOfTarget = rerootTargetPath(normalizedCurrentFilePath, absoluteTargetPath, normalizedCwd, layersConfig)
    ?? absoluteTargetPath;

  const resolutionOptions = { layersConfig, segmentsConfig, hasPublicApi };

  const resolvedPartsOfTarget = extractFeatureSlicedParts(absoluteTargetPath, normalizedCwd, { ...resolutionOptions, slicePath: slicePathOfTarget });
  const resolvedPartsOfCurrentFile = extractFeatureSlicedParts(normalizedCurrentFilePath, normalizedCwd, resolutionOptions);

  /*
   * The only place that holds both sides at once, so the only place the never-mix rule can be
   * stated: a side that the filesystem could not answer takes the whole comparison back to the
   * path heuristic. A failed probe never means "the same slice", because that is the verdict
   * that skips validation.
   */
  const bothSidesResolved = resolvedPartsOfTarget.resolved && resolvedPartsOfCurrentFile.resolved;

  const fsdPartsOfTarget = bothSidesResolved ? resolvedPartsOfTarget : withFallbackSlice(resolvedPartsOfTarget);
  const fsdPartsOfCurrentFile = bothSidesResolved ? resolvedPartsOfCurrentFile : withFallbackSlice(resolvedPartsOfCurrentFile);

  const validatedFeatureSlicedPartsOfTarget = validateExtractedFeatureSlicedParts(fsdPartsOfTarget, layersConfig);
  const validatedFeatureSlicedPartsOfCurrentFile = validateExtractedFeatureSlicedParts(fsdPartsOfCurrentFile, layersConfig);

  const {
    hasUnknownLayers,
    isSameLayer,
    isSameSlice,
    isSameSegment,
    isSameLayerWithoutSlices,
  } = compareFeatureSlicedParts({
    target: {
      validatedFeatureSlicedParts: validatedFeatureSlicedPartsOfTarget,
      fsdParts: fsdPartsOfTarget,
    },
    currentFile: {
      validatedFeatureSlicedParts: validatedFeatureSlicedPartsOfCurrentFile,
      fsdParts: fsdPartsOfCurrentFile,
    },
  });

  return {
    targetPath,
    normalizedTargetPath,
    normalizedCurrentFilePath,
    absoluteTargetPath,

    fsdPartsOfTarget,
    fsdPartsOfCurrentFile,

    isSameLayer,
    isSameSlice,
    isSameSegment,
    isSameLayerWithoutSlices,
    hasUnknownLayers,

    validatedFeatureSlicedPartsOfTarget,
    validatedFeatureSlicedPartsOfCurrentFile,
  };
}

export type PathsInfo = ReturnType<typeof extractPathsInfo>;
