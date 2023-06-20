import {
  normalizePath,
  convertToAbsolute,
  isPathRelative,
} from '../path-lib';
import type {
  ImportExportNodesWithSourceValue,
  UnknownRuleContext,
} from '../rule-lib';
import { isNodeType } from '../rule-lib';
import { isNull } from '../shared';
import { extractLayer } from './extract-layer';
import { extractSegment } from './extract-segment';
import { extractSlice } from './extract-slice';
import {
  canLayerContainSlices,
  isLayer,
} from './layers';

function extractPaths(node: ImportExportNodesWithSourceValue, context: UnknownRuleContext) {
  const targetPath = node.source.value;
  const currentFilePath = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename(); /* FIXME: getFilename is deprecated */

  const normalizedCurrentFilePath = normalizePath(currentFilePath);
  const normalizedTargetPath = normalizePath(targetPath);
  const absoluteTargetPath = convertToAbsolute(normalizedCurrentFilePath, normalizedTargetPath);

  return {
    targetPath,
    currentFilePath,
    normalizedTargetPath,
    normalizedCurrentFilePath,
    absoluteTargetPath,
  };
}

function extractFeatureSlicedParts(targetPath: string) {
  const layer = extractLayer(targetPath);
  const slice = extractSlice(targetPath);
  const [segment, segmentFiles] = extractSegment(targetPath);

  return {
    layer,
    slice,
    segment,
    segmentFiles,
  };
}

type ExtractedFeatureSlicedParts = ReturnType<typeof extractFeatureSlicedParts>;

function validateExtractedFeatureSlicedParts(extractedFeatureSlicedParts: ExtractedFeatureSlicedParts) {
  const {
    layer,
    slice,
    segment,
    segmentFiles,
  } = extractedFeatureSlicedParts;

  const hasLayer = isLayer(layer);
  const hasNotLayer = !hasLayer;
  const hasSlice = !isNull(slice);
  const hasNotSlice = !hasSlice;
  const hasSegment = !isNull(segment);
  const hasNotSegment = !hasSegment;
  const hasSegmentFiles = !isNull(segmentFiles);
  const hasNotSegmentFiles = !hasSegmentFiles;

  const canContainSlices = hasLayer && canLayerContainSlices(layer);

  return {
    hasLayer,
    hasNotLayer,
    hasSlice,
    hasNotSlice,
    hasSegment,
    hasNotSegment,
    hasSegmentFiles,
    hasNotSegmentFiles,
    canLayerContainSlices: canContainSlices,
  };
}

export function extractPathsInfo(node: ImportExportNodesWithSourceValue, context: UnknownRuleContext) {
  const {
    targetPath,
    currentFilePath,
    normalizedTargetPath,
    normalizedCurrentFilePath,
    absoluteTargetPath,
  } = extractPaths(node, context);

  const targetPathFeatureSlicedParts = extractFeatureSlicedParts(absoluteTargetPath);
  const currentFileFeatureSlicedParts = extractFeatureSlicedParts(normalizedCurrentFilePath);

  const validatedFeatureSlicedPartsOfTarget = validateExtractedFeatureSlicedParts(targetPathFeatureSlicedParts);
  const validatedFeatureSlicedPartsOfCurrentFile = validateExtractedFeatureSlicedParts(currentFileFeatureSlicedParts);

  const hasUnknownLayers = validatedFeatureSlicedPartsOfTarget.hasNotLayer || validatedFeatureSlicedPartsOfCurrentFile.hasNotLayer;
  const isType = isNodeType(node);
  const isRelative = isPathRelative(normalizedTargetPath);
  const isSameLayer = targetPathFeatureSlicedParts.layer === currentFileFeatureSlicedParts.layer;
  const isSameSlice = validatedFeatureSlicedPartsOfTarget.hasSlice && validatedFeatureSlicedPartsOfCurrentFile.hasSlice
    && targetPathFeatureSlicedParts.slice === currentFileFeatureSlicedParts.slice;
  const isSameSegment = targetPathFeatureSlicedParts.segment === currentFileFeatureSlicedParts.segment;
  /**
   * Whether the import/export file and the current file are inside the same layer that cannot contain slices
   */
  const isSameLayerWithoutSlices = isSameLayer
    && !validatedFeatureSlicedPartsOfTarget.canLayerContainSlices
    && !validatedFeatureSlicedPartsOfCurrentFile.canLayerContainSlices;

  return {
    targetPath,
    currentFilePath,
    normalizedTargetPath,
    normalizedCurrentFilePath,
    absoluteTargetPath,

    importLayer: targetPathFeatureSlicedParts.layer,
    importSlice: targetPathFeatureSlicedParts.slice,
    segment: targetPathFeatureSlicedParts.segment,
    segmentFiles: targetPathFeatureSlicedParts.segmentFiles,

    currentFileLayer: currentFileFeatureSlicedParts.layer,
    currentFileSlice: currentFileFeatureSlicedParts.slice,
    currentFileSegmentFiles: currentFileFeatureSlicedParts.segmentFiles,

    isType,
    isRelative,
    isSameLayer,
    isSameSlice,
    isSameSegment,
    isSameLayerWithoutSlices,
    hasUnknownLayers,

    hasLayer: validatedFeatureSlicedPartsOfTarget.hasLayer,
    hasNotLayer: validatedFeatureSlicedPartsOfTarget.hasNotLayer,
    hasNotSlice: validatedFeatureSlicedPartsOfTarget.hasNotSlice,
    hasSegment: validatedFeatureSlicedPartsOfTarget.hasSegment,
    hasNotSegment: validatedFeatureSlicedPartsOfTarget.hasNotSegment,
    hasSegmentFiles: validatedFeatureSlicedPartsOfTarget.hasSegmentFiles,
    hasNotSegmentFiles: validatedFeatureSlicedPartsOfTarget.hasNotSegmentFiles,

    hasCurrentFileLayer: validatedFeatureSlicedPartsOfCurrentFile.hasLayer,
    hasNotCurrentFileLayer: validatedFeatureSlicedPartsOfCurrentFile.hasNotLayer,
    hasNotCurrentFileSlice: validatedFeatureSlicedPartsOfCurrentFile.hasNotSlice,
    hasCurrentFileSegment: validatedFeatureSlicedPartsOfCurrentFile.hasSegment,
    hasNotCurrentFileSegment: validatedFeatureSlicedPartsOfCurrentFile.hasNotSegment,
    hasCurrentFileSegmentFiles: validatedFeatureSlicedPartsOfCurrentFile.hasSegmentFiles,
    hasNotCurrentFileSegmentFiles: validatedFeatureSlicedPartsOfCurrentFile.hasNotSegmentFiles,
  };
}

export type PathsInfo = ReturnType<typeof extractPathsInfo>
