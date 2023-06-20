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

/* TODO: remove 'import' prefix from all vars */
export function extractPathsInfo(node: ImportExportNodesWithSourceValue, context: UnknownRuleContext) {
  const currentFilePath = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename(); /* FIXME: getFilename is deprecated */
  const importPath = node.source.value;

  const normalizedCurrentFilePath = normalizePath(currentFilePath);
  const normalizedImportPath = normalizePath(importPath);
  const importAbsolutePath = convertToAbsolute(normalizedCurrentFilePath, normalizedImportPath);

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

  const hasLayer = isLayer(importLayer);
  const hasCurrentFileLayer = isLayer(currentFileLayer);
  const hasNotLayer = !hasLayer;
  const hasNotCurrentFileLayer = !hasCurrentFileLayer;
  const hasUnknownLayers = hasNotLayer || hasNotCurrentFileLayer;
  const hasSlice = !isNull(importSlice);
  const hasCurrentFileSlice = !isNull(currentFileSlice);
  const hasSegment = !isNull(segment);
  const hasCurrentFileSegment = !isNull(currentFileSegment);
  const hasNotSegment = !hasSegment;
  const hasNotCurrentFileSegment = !hasCurrentFileSegment;
  const hasSegmentFiles = !isNull(segmentFiles);
  const hasCurrentFileSegmentFiles = !isNull(currentFileSegmentFiles);
  const hasNotSegmentFiles = !hasSegmentFiles;
  const hasNotCurrentFileSegmentFiles = !hasCurrentFileSegmentFiles;

  const hasNotSlice = !hasSlice;
  const hasNotCurrentFileSlice = !hasCurrentFileLayer;

  const isType = isNodeType(node);
  const isRelative = isPathRelative(normalizedImportPath);
  const isSameLayer = importLayer === currentFileLayer;
  const isSameSlice = hasSlice && hasCurrentFileSlice && importSlice === currentFileSlice;
  const isSameSegment = segment === currentFileSegment;

  const canImportLayerContainSlices = hasLayer && canLayerContainSlices(importLayer);
  const canCurrentFileLayerContainSlices = hasCurrentFileLayer && canLayerContainSlices(currentFileLayer);

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
