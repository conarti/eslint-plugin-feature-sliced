import type { NormalizedLayerConfig } from '../../config';
import {
  extractPaths,
  type ImportExportNodesWithSourceValue,
  type UnknownRuleContext,
} from '../rule';
import {
  type ExtractedFeatureSlicedParts,
  extractFeatureSlicedParts,
} from './extract-feature-sliced-parts';
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
    && target.validatedFeatureSlicedParts.hasSlice && currentFile.validatedFeatureSlicedParts.hasSlice
    && target.fsdParts.slice === currentFile.fsdParts.slice;
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

  const fsdPartsOfTarget = extractFeatureSlicedParts(absoluteTargetPath, normalizedCwd, { layersConfig, segmentsConfig });
  const fsdPartsOfCurrentFile = extractFeatureSlicedParts(normalizedCurrentFilePath, normalizedCwd, { layersConfig, segmentsConfig });

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
