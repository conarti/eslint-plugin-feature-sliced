import { type Layer } from '../../config';
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

  return {
    hasLayer,
    hasNotLayer,
    hasSlice,
    hasNotSlice,
    hasSegment,
    hasNotSegment,
    hasSegmentFiles,
    hasNotSegmentFiles,
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

  const {
    layer: importLayer,
    slice: importSlice,
    segment,
    segmentFiles,
  } = extractLayerSliceSegment(importAbsolutePath);

  const {
    layer: currentFileLayer,
    slice: currentFileSlice,
    segment: currentFileSegment,
    segmentFiles: currentFileSegmentFiles,
  } = extractLayerSliceSegment(normalizedCurrentFilePath);

  const {
    hasLayer,
    hasNotLayer,
    hasSlice,
    hasNotSlice,
    hasSegment,
    hasNotSegment,
    hasSegmentFiles,
    hasNotSegmentFiles,
  } = validateLayerSliceSegment({
    layer: importLayer,
    slice: importSlice,
    segment,
    segmentFiles,
  });

  const {
    hasLayer: hasCurrentFileLayer,
    hasNotLayer: hasNotCurrentFileLayer,
    hasSlice: hasCurrentFileSlice,
    hasNotSlice: hasNotCurrentFileSlice,
    hasSegment: hasCurrentFileSegment,
    hasNotSegment: hasNotCurrentFileSegment,
    hasSegmentFiles: hasCurrentFileSegmentFiles,
    hasNotSegmentFiles: hasNotCurrentFileSegmentFiles,
  } = validateLayerSliceSegment({
    layer: currentFileLayer,
    slice: currentFileSlice,
    segment: currentFileSegment,
    segmentFiles: currentFileSegmentFiles,
  });

  const hasUnknownLayers = hasNotLayer || hasNotCurrentFileLayer;

  const isType = isNodeType(node);
  const isRelative = isPathRelative(normalizedImportPath);
  const isSameLayer = importLayer === currentFileLayer;
  const isSameSlice = hasSlice && hasCurrentFileSlice && importSlice === currentFileSlice;
  const isSameSegment = segment === currentFileSegment;

  const canImportLayerContainSlices = hasLayer && canLayerContainSlices(importLayer as Layer);
  const canCurrentFileLayerContainSlices = hasCurrentFileLayer && canLayerContainSlices(currentFileLayer as Layer);

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
    importLayer,
    importSlice,
    segment,
    segmentFiles,
    currentFileLayer,
    currentFileSlice,
    currentFileSegmentFiles,
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
