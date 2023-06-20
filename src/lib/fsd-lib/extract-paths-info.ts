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
import { extractSegments } from './extract-segments';
import { getLayerSliceFromPath } from './get-layer-slice-from-path';
import {
  canLayerContainSlices,
  isLayer,
} from './layers';

/* TODO: remove 'import' prefix from all vars */
export function extractPathsInfo(node: ImportExportNodesWithSourceValue, context: UnknownRuleContext) {
  const currentFilePath = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename(); /* FIXME: getFilename is deprecated */
  const importPath = node.source.value;

  const normalizedCurrentFilePath = normalizePath(currentFilePath);
  const normalizedImportPath = normalizePath(importPath);

  const importAbsolutePath = convertToAbsolute(normalizedCurrentFilePath, normalizedImportPath);
  const [importLayer, importSlice] = getLayerSliceFromPath(importAbsolutePath);
  const [currentFileLayer, currentFileSlice] = getLayerSliceFromPath(normalizedCurrentFilePath);
  const {
    segment,
    segmentFiles,
  } = extractSegments(importAbsolutePath);
  const {
    segment: currentFileSegment,
    segmentFiles: currentFileSegmentFiles,
  } = extractSegments(currentFilePath);

  const hasLayer = isLayer(importLayer);
  const hasCurrentFileLayer = isLayer(currentFileLayer);
  const hasNotLayer = !hasLayer;
  const hasNotCurrentFileLayer = !hasCurrentFileLayer;
  const hasUnknownLayers = hasNotLayer || hasNotCurrentFileLayer;
  const hasSlice = !isNull(importSlice);
  const hasCurrentFileSlice = !isNull(currentFileSlice);

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
    hasNotLayer,
    hasNotSlice,
    hasNotCurrentFileLayer,
    hasNotCurrentFileSlice,
    hasUnknownLayers,
  };
}

export type PathsInfo = ReturnType<typeof extractPathsInfo>
