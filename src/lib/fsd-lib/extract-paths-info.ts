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
  const currentFilePath = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename(); /* FIXME: getFilename is deprecated */
  const importPath = node.source.value;

  const normalizedCurrentFilePath = normalizePath(currentFilePath);
  const normalizedImportPath = normalizePath(importPath);
  const importAbsolutePath = convertToAbsolute(normalizedCurrentFilePath, normalizedImportPath);

  return {
    currentFilePath,
    importPath,
    normalizedCurrentFilePath,
    normalizedImportPath,
    importAbsolutePath,
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

/* TODO: remove 'import' prefix from all vars */
export function extractPathsInfo(node: ImportExportNodesWithSourceValue, context: UnknownRuleContext) {
  const {
    currentFilePath,
    importPath,
    normalizedCurrentFilePath,
    normalizedImportPath,
    importAbsolutePath,
  } = extractPaths(node, context);

  const importLayerSliceSegment = extractFeatureSlicedParts(importAbsolutePath);
  const currentFileLayerSliceSegment = extractFeatureSlicedParts(normalizedCurrentFilePath);

  const fsdInfoOfImport = validateExtractedFeatureSlicedParts(importLayerSliceSegment);
  const fsdInfoOfCurrentFile = validateExtractedFeatureSlicedParts(currentFileLayerSliceSegment);

  const hasUnknownLayers = fsdInfoOfImport.hasNotLayer || fsdInfoOfCurrentFile.hasNotLayer;
  const isType = isNodeType(node);
  const isRelative = isPathRelative(normalizedImportPath);
  const isSameLayer = importLayerSliceSegment.layer === currentFileLayerSliceSegment.layer;
  const isSameSlice = fsdInfoOfImport.hasSlice && fsdInfoOfCurrentFile.hasSlice
    && importLayerSliceSegment.slice === currentFileLayerSliceSegment.slice;
  const isSameSegment = importLayerSliceSegment.segment === currentFileLayerSliceSegment.segment;
  /**
   * Whether the import/export file and the current file are inside the same layer that cannot contain slices
   */
  const isSameLayerWithoutSlices = isSameLayer
    && !fsdInfoOfImport.canLayerContainSlices
    && !fsdInfoOfCurrentFile.canLayerContainSlices;

  return {
    importPath,
    importAbsolutePath,
    currentFilePath,
    normalizedImportPath,
    normalizedCurrentFilePath,

    importLayer: importLayerSliceSegment.layer,
    importSlice: importLayerSliceSegment.slice,
    segment: importLayerSliceSegment.segment,
    segmentFiles: importLayerSliceSegment.segmentFiles,

    currentFileLayer: currentFileLayerSliceSegment.layer,
    currentFileSlice: currentFileLayerSliceSegment.slice,
    currentFileSegmentFiles: currentFileLayerSliceSegment.segmentFiles,

    isType,
    isRelative,
    isSameLayer,
    isSameSlice,
    isSameSegment,
    isSameLayerWithoutSlices,
    hasUnknownLayers,

    hasLayer: fsdInfoOfImport.hasLayer,
    hasNotLayer: fsdInfoOfImport.hasNotLayer,
    hasNotSlice: fsdInfoOfImport.hasNotSlice,
    hasSegment: fsdInfoOfImport.hasSegment,
    hasNotSegment: fsdInfoOfImport.hasNotSegment,
    hasSegmentFiles: fsdInfoOfImport.hasSegmentFiles,
    hasNotSegmentFiles: fsdInfoOfImport.hasNotSegmentFiles,

    hasCurrentFileLayer: fsdInfoOfCurrentFile.hasLayer,
    hasNotCurrentFileLayer: fsdInfoOfCurrentFile.hasNotLayer,
    hasNotCurrentFileSlice: fsdInfoOfCurrentFile.hasNotSlice,
    hasCurrentFileSegment: fsdInfoOfCurrentFile.hasSegment,
    hasNotCurrentFileSegment: fsdInfoOfCurrentFile.hasNotSegment,
    hasCurrentFileSegmentFiles: fsdInfoOfCurrentFile.hasSegmentFiles,
    hasNotCurrentFileSegmentFiles: fsdInfoOfCurrentFile.hasNotSegmentFiles,
  };
}

export type PathsInfo = ReturnType<typeof extractPathsInfo>
