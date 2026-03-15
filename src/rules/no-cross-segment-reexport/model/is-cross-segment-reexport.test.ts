import { normalizeLayersConfig } from '../../../lib/feature-sliced/layers-config';
import {
  extractSegmentAndSlice,
  findLayerIndex,
  findTargetSegmentInSameSlice,
  isCrossSegmentReexport,
  removeFilenameParts,
  splitPathParts,
} from './is-cross-segment-reexport';

describe('splitPathParts', () => {
  it('should split path into non-empty parts', () => {
    expect(splitPathParts('src/entities/cluster/model')).toEqual(['src', 'entities', 'cluster', 'model']);
  });

  it('should filter out empty parts from leading slash', () => {
    expect(splitPathParts('/src/entities/cluster')).toEqual(['src', 'entities', 'cluster']);
  });

  it('should filter out empty parts from trailing slash', () => {
    expect(splitPathParts('src/entities/')).toEqual(['src', 'entities']);
  });

  it('should return empty array for empty string', () => {
    expect(splitPathParts('')).toEqual([]);
  });

  it('should return empty array for single slash', () => {
    expect(splitPathParts('/')).toEqual([]);
  });
});

describe('removeFilenameParts', () => {
  it('should remove parts with file extensions', () => {
    expect(removeFilenameParts(['cluster', 'model', 'index.ts'])).toEqual(['cluster', 'model']);
  });

  it('should handle multiple file extensions', () => {
    expect(removeFilenameParts(['ui', 'Component.tsx', 'styles.css'])).toEqual(['ui']);
  });

  it('should keep directory-only parts', () => {
    expect(removeFilenameParts(['cluster', 'model', 'store'])).toEqual(['cluster', 'model', 'store']);
  });

  it('should return empty array when all parts are filenames', () => {
    expect(removeFilenameParts(['index.ts'])).toEqual([]);
  });

  it('should return same array when no filenames present', () => {
    expect(removeFilenameParts(['model', 'store'])).toEqual(['model', 'store']);
  });
});

describe('findLayerIndex', () => {
  const layersWithSlices = ['entities', 'features', 'widgets', 'pages', 'processes'];

  it('should find layer index in path parts', () => {
    expect(findLayerIndex(['src', 'entities', 'cluster'], layersWithSlices)).toBe(1);
  });

  it('should return -1 when no layer found', () => {
    expect(findLayerIndex(['src', 'shared', 'lib'], layersWithSlices)).toBe(-1);
  });

  it('should be case-insensitive', () => {
    expect(findLayerIndex(['src', 'Entities', 'cluster'], layersWithSlices)).toBe(1);
  });

  it('should find first matching layer', () => {
    expect(findLayerIndex(['entities', 'features'], layersWithSlices)).toBe(0);
  });

  it('should return -1 for empty parts', () => {
    expect(findLayerIndex([], layersWithSlices)).toBe(-1);
  });
});

describe('extractSegmentAndSlice', () => {
  it('should extract segment and slice for standard path', () => {
    expect(extractSegmentAndSlice(['cluster', 'model'])).toEqual({
      segment: 'model',
      sliceParts: ['cluster'],
    });
  });

  it('should extract segment and slice for group folder', () => {
    expect(extractSegmentAndSlice(['group', 'User', 'model'])).toEqual({
      segment: 'model',
      sliceParts: ['group', 'User'],
    });
  });

  it('should extract non-standard segment', () => {
    expect(extractSegmentAndSlice(['cluster', 'i18n'])).toEqual({
      segment: 'i18n',
      sliceParts: ['cluster'],
    });
  });

  it('should treat last directory as segment when no known segment found', () => {
    expect(extractSegmentAndSlice(['cluster', 'custom-segment', 'subfolder'])).toEqual({
      segment: 'subfolder',
      sliceParts: ['cluster', 'custom-segment'],
    });
  });

  it('should return null for single part (no slice)', () => {
    expect(extractSegmentAndSlice(['model'])).toBeNull();
  });

  it('should return null for empty array', () => {
    expect(extractSegmentAndSlice([])).toBeNull();
  });

  it('should return null when known segment is at index 0 (no slice)', () => {
    expect(extractSegmentAndSlice(['model', 'store'])).toBeNull();
  });

  it('should handle deeply nested segment paths', () => {
    expect(extractSegmentAndSlice(['cluster', 'model', 'store'])).toEqual({
      segment: 'model',
      sliceParts: ['cluster'],
    });
  });

  it('should handle all known FSD segments', () => {
    const knownSegments = ['ui', 'model', 'lib', 'api', 'config', 'assets'];
    for (const segment of knownSegments) {
      expect(extractSegmentAndSlice(['slice', segment])).toEqual({
        segment,
        sliceParts: ['slice'],
      });
    }
  });
});

describe('findTargetSegmentInSameSlice', () => {
  it('should return target segment when it differs from current', () => {
    expect(findTargetSegmentInSameSlice(['cluster', 'api'], ['cluster'], 'model')).toBe('api');
  });

  it('should return null when target segment is the same', () => {
    expect(findTargetSegmentInSameSlice(['cluster', 'model'], ['cluster'], 'model')).toBeNull();
  });

  it('should return null when target has different slice', () => {
    expect(findTargetSegmentInSameSlice(['other-slice', 'api'], ['cluster'], 'model')).toBeNull();
  });

  it('should return null when target path is empty', () => {
    expect(findTargetSegmentInSameSlice([], ['cluster'], 'model')).toBeNull();
  });

  it('should return null when target is shorter than slice prefix', () => {
    expect(findTargetSegmentInSameSlice(['cluster'], ['cluster', 'sub'], 'model')).toBeNull();
  });

  it('should handle group folder slices', () => {
    expect(findTargetSegmentInSameSlice(['group', 'User', 'api'], ['group', 'User'], 'model')).toBe('api');
  });

  it('should return null when group folder slice differs', () => {
    expect(findTargetSegmentInSameSlice(['group', 'Admin', 'api'], ['group', 'User'], 'model')).toBeNull();
  });

  it('should be case-insensitive for slice comparison', () => {
    expect(findTargetSegmentInSameSlice(['Cluster', 'api'], ['cluster'], 'model')).toBe('api');
  });

  it('should be case-insensitive for segment comparison', () => {
    expect(findTargetSegmentInSameSlice(['cluster', 'Model'], ['cluster'], 'model')).toBeNull();
  });

  it('should return null when no segment after slice', () => {
    expect(findTargetSegmentInSameSlice(['cluster'], ['cluster'], 'model')).toBeNull();
  });
});

describe('isCrossSegmentReexport', () => {
  const defaultConfig = normalizeLayersConfig();

  it('should detect cross-segment re-export', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cluster/model/index.ts',
      'src/entities/cluster/api',
      defaultConfig,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: true,
      currentSegment: 'model',
      targetSegment: 'api',
    });
  });

  it('should not flag same-segment reference', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cluster/model/index.ts',
      'src/entities/cluster/model/store',
      defaultConfig,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: false,
      currentSegment: null,
      targetSegment: null,
    });
  });

  it('should not flag cross-layer reference', () => {
    const result = isCrossSegmentReexport(
      'src/features/auth/model/index.ts',
      'src/entities/user/api',
      defaultConfig,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: false,
      currentSegment: null,
      targetSegment: null,
    });
  });

  it('should not flag layers without slices', () => {
    const result = isCrossSegmentReexport(
      'src/shared/lib/index.ts',
      'src/shared/utils',
      defaultConfig,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: false,
      currentSegment: null,
      targetSegment: null,
    });
  });

  it('should detect cross-segment in group folders', () => {
    const result = isCrossSegmentReexport(
      'src/entities/group/User/model/index.ts',
      'src/entities/group/User/api',
      defaultConfig,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: true,
      currentSegment: 'model',
      targetSegment: 'api',
    });
  });

  it('should detect non-standard segment re-export', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cluster/model/index.ts',
      'src/entities/cluster/i18n',
      defaultConfig,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: true,
      currentSegment: 'model',
      targetSegment: 'i18n',
    });
  });

  it('should detect cross-segment from nested file', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cluster/model/store/index.ts',
      'src/entities/cluster/api',
      defaultConfig,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: true,
      currentSegment: 'model',
      targetSegment: 'api',
    });
  });

  it('should not flag slice public API (file at slice root)', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cluster/index.ts',
      'src/entities/cluster/model',
      defaultConfig,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: false,
      currentSegment: null,
      targetSegment: null,
    });
  });

  it('should not flag when no layer is found', () => {
    const result = isCrossSegmentReexport(
      'lib/utils/foo/index.ts',
      'lib/utils/bar',
      defaultConfig,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: false,
      currentSegment: null,
      targetSegment: null,
    });
  });

  it('should work with custom layers config', () => {
    const customConfig = normalizeLayersConfig([
      { name: 'shared', hasSlices: false },
      'domain',
      'features',
      { name: 'app', hasSlices: false },
    ]);

    const result = isCrossSegmentReexport(
      'src/domain/user/model/index.ts',
      'src/domain/user/api',
      customConfig,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: true,
      currentSegment: 'model',
      targetSegment: 'api',
    });
  });

  it('should use default config when none provided', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cluster/model/index.ts',
      'src/entities/cluster/api',
    );

    expect(result).toEqual({
      isCrossSegmentReexport: true,
      currentSegment: 'model',
      targetSegment: 'api',
    });
  });

  it('should not flag different slices in same layer', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cluster/model/index.ts',
      'src/entities/user/api',
      defaultConfig,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: false,
      currentSegment: null,
      targetSegment: null,
    });
  });
});
