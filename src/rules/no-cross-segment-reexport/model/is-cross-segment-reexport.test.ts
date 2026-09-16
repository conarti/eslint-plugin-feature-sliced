import { normalizeLayersConfig } from '../../../lib/feature-sliced/layers-config';
import { isCrossSegmentReexport } from './is-cross-segment-reexport';

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

  it('should detect cross-segment when current segment is a file', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cluster/model.ts',
      'src/entities/cluster/api',
      defaultConfig,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: true,
      currentSegment: 'model',
      targetSegment: 'api',
    });
  });

  it('should detect cross-segment when target segment is a file', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cluster/model/index.ts',
      'src/entities/cluster/api.ts',
      defaultConfig,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: true,
      currentSegment: 'model',
      targetSegment: 'api',
    });
  });

  it('should detect cross-segment when both segments are files', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cluster/model.ts',
      'src/entities/cluster/api.ts',
      defaultConfig,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: true,
      currentSegment: 'model',
      targetSegment: 'api',
    });
  });

  it('should not flag same segment when both are files', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cluster/model.ts',
      'src/entities/cluster/model',
      defaultConfig,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: false,
      currentSegment: null,
      targetSegment: null,
    });
  });
});
