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
import { getLayerSliceFromPath } from './get-layer-slice-from-path';
import { isLayer } from './layers';
import { getFsdPartsFromPath } from './get-fsd-parts-from-path';

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
  const isUnknownLayer = !isLayer(importLayer);
  const isSameSlice = importSlice === currentFileSlice;

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
    isUnknownLayer,
    isSameSlice,
    isSameSegment,
  };
}

export type PathsInfo = ReturnType<typeof extractPathsInfo>
