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
import { getLayerSliceFromPath } from './get-layer-slice-from-path';
import { getFsdPartsFromPath } from './get-fsd-parts-from-path';
import {
  canLayerContainSlices,
  isLayer,
} from './layers';

/* TODO: remove 'import' prefix from all vars */
export function extractPathsInfo(node: ImportExportNodesWithSourceValue, context: UnknownRuleContext) {
  const currentFilePath = context.getFilename(); /* FIXME: getFilename is deprecated */
  const importPath = node.source.value;

  const normalizedCurrentFilePath = normalizePath(currentFilePath);
  const normalizedImportPath = normalizePath(importPath);

  const importAbsolutePath = convertToAbsolute(normalizedCurrentFilePath, normalizedImportPath);
  const [importLayer, importSlice] = getLayerSliceFromPath(importAbsolutePath);
  const [currentFileLayer, currentFileSlice] = getLayerSliceFromPath(normalizedCurrentFilePath);

  const isType = isNodeType(node);
  const isRelative = isPathRelative(normalizedImportPath);
  const isSameLayer = importLayer === currentFileLayer;
  const isSameSlice = importSlice === currentFileSlice;

  const hasLayer = isLayer(importLayer);
  const hasCurrentFileLayer = isLayer(currentFileLayer);
  const hasNotLayer = !hasLayer;
  const hasNotCurrentFileLayer = !hasCurrentFileLayer;
  const hasUnknownLayers = hasNotLayer || hasNotCurrentFileLayer;

  const hasNotSlice = isNull(importSlice);
  const hasNotCurrentFileSlice = isNull(currentFileSlice);

  const canImportLayerContainSlices = hasLayer && canLayerContainSlices(importLayer);
  const canCurrentFileLayerContainSlices = hasCurrentFileLayer && canLayerContainSlices(currentFileLayer);

  /**
   * Whether the import/export file and the current file are inside the same layer that cannot contain slices
   */
  const isSameLayerWithoutSlices =
    isSameLayer
    && !canImportLayerContainSlices
    && !canCurrentFileLayerContainSlices;

  /** TODO: move getting 'segment', 'segmentFiles' logic to this func. Delete 'getFsdPartsFromPath'  */
  const {
    segment,
    segmentFiles,
  } = getFsdPartsFromPath(importAbsolutePath);
  const { segment: currentFileSegment } = getFsdPartsFromPath(currentFilePath);
  const isSameSegment = segment === currentFileSegment;

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
    isType,
    isRelative,
    isSameLayer,
    isSameSlice,
    isSameSegment,
    isSameLayerWithoutSlices,
    hasNotLayer,
    hasNotSlice,
    hasNotCurrentFileLayer,
    hasNotCurrentFileSlice,
    hasUnknownLayers,
  };
}

export type PathsInfo = ReturnType<typeof extractPathsInfo>
