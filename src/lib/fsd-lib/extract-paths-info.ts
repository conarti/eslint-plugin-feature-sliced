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

function extractLayerSliceSegment(targetPath: string) {
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

type ExtractedLayerSliceSegment = ReturnType<typeof extractLayerSliceSegment>;

function validateLayerSliceSegment(layerSliceSegment: ExtractedLayerSliceSegment) {
  const {
    layer,
    slice,
    segment,
    segmentFiles,
  } = layerSliceSegment;

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

  const importLayerSliceSegment = extractLayerSliceSegment(importAbsolutePath);
  const currentFileLayerSliceSegment = extractLayerSliceSegment(normalizedCurrentFilePath);

  const {
    hasLayer,
    hasNotLayer,
    hasSlice,
    hasNotSlice,
    hasSegment,
    hasNotSegment,
    hasSegmentFiles,
    hasNotSegmentFiles,
    canLayerContainSlices: canImportLayerContainSlices,
  } = validateLayerSliceSegment(importLayerSliceSegment);
  const {
    hasLayer: hasCurrentFileLayer,
    hasNotLayer: hasNotCurrentFileLayer,
    hasSlice: hasCurrentFileSlice,
    hasNotSlice: hasNotCurrentFileSlice,
    hasSegment: hasCurrentFileSegment,
    hasNotSegment: hasNotCurrentFileSegment,
    hasSegmentFiles: hasCurrentFileSegmentFiles,
    hasNotSegmentFiles: hasNotCurrentFileSegmentFiles,
    canLayerContainSlices: canCurrentFileLayerContainSlices,
  } = validateLayerSliceSegment(currentFileLayerSliceSegment);

  const hasUnknownLayers = hasNotLayer || hasNotCurrentFileLayer;

  const isType = isNodeType(node);
  const isRelative = isPathRelative(normalizedImportPath);
  const isSameLayer = importLayerSliceSegment.layer === currentFileLayerSliceSegment.layer;
  const isSameSlice = hasSlice && hasCurrentFileSlice && importLayerSliceSegment.slice === currentFileLayerSliceSegment.slice;
  const isSameSegment = importLayerSliceSegment.segment === currentFileLayerSliceSegment.segment;
  /**
   * Whether the import/export file and the current file are inside the same layer that cannot contain slices
   */
  const isSameLayerWithoutSlices = isSameLayer
    && !canImportLayerContainSlices
    && !canCurrentFileLayerContainSlices;

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
    hasCurrentFileLayer,
    hasLayer,
    hasNotLayer,
    hasNotSlice,
    hasNotCurrentFileLayer,
    hasNotCurrentFileSlice,
    hasUnknownLayers,
    hasSegment,
    hasNotSegment,
    hasCurrentFileSegment,
    hasNotCurrentFileSegment,
    hasSegmentFiles,
    hasNotSegmentFiles,
    hasCurrentFileSegmentFiles,
    hasNotCurrentFileSegmentFiles,
  };
}

export type PathsInfo = ReturnType<typeof extractPathsInfo>
