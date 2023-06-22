import {
  type ImportExportNodesWithSourceValue,
  type UnknownRuleContext,
} from '../rule-lib';
import {
  type ExtractedFeatureSlicedParts,
  extractFeatureSlicedParts,
} from './extract-feature-sliced-parts';
import { extractPaths } from './extract-paths';
import {
  type ValidatedFeatureSlicedParts,
  validateExtractedFeatureSlicedParts,
} from './validate-extracted-feature-sliced-parts';

type FSPartsToCompare = {
  target: {
    validatedFeatureSlicedParts: ValidatedFeatureSlicedParts,
    fsdParts: ExtractedFeatureSlicedParts,
  },
  currentFile: {
    validatedFeatureSlicedParts: ValidatedFeatureSlicedParts,
    fsdParts: ExtractedFeatureSlicedParts,
  }
};

function compareFeatureSlicedParts(fsPartsToCompare: FSPartsToCompare) {
  const {
    target,
    currentFile,
  } = fsPartsToCompare;

  const hasUnknownLayers = target.validatedFeatureSlicedParts.hasNotLayer || currentFile.validatedFeatureSlicedParts.hasNotLayer;
  const isSameLayer = target.fsdParts.layer === currentFile.fsdParts.layer;
  const isSameSlice = target.validatedFeatureSlicedParts.hasSlice && currentFile.validatedFeatureSlicedParts.hasSlice
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

export function extractPathsInfo(node: ImportExportNodesWithSourceValue, context: UnknownRuleContext) {
  const {
    targetPath,
    currentFilePath,
    normalizedTargetPath,
    normalizedCurrentFilePath,
    absoluteTargetPath,
    normalizedCwd,
  } = extractPaths(node, context);

  const fsdPartsOfTarget = extractFeatureSlicedParts(absoluteTargetPath, normalizedCwd);
  const fsdPartsOfCurrentFile = extractFeatureSlicedParts(normalizedCurrentFilePath, normalizedCwd);

  const validatedFeatureSlicedPartsOfTarget = validateExtractedFeatureSlicedParts(fsdPartsOfTarget);
  const validatedFeatureSlicedPartsOfCurrentFile = validateExtractedFeatureSlicedParts(fsdPartsOfCurrentFile);

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
    currentFilePath,
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

export type PathsInfo = ReturnType<typeof extractPathsInfo>
