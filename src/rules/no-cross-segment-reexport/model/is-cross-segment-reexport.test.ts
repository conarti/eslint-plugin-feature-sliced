import { DEFAULT_SEGMENTS } from '../../../config';
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

  it('should not flag a sibling file when the segment folder is not a known segment', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cart/services/cart-service.ts',
      'src/entities/cart/services/helpers',
      defaultConfig,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: false,
      currentSegment: null,
      targetSegment: null,
    });
  });

  it('should detect cross-segment from a file inside a known segment folder', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cart/model/store.ts',
      'src/entities/cart/api',
      defaultConfig,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: true,
      currentSegment: 'model',
      targetSegment: 'api',
    });
  });

  it('should detect cross-segment when an unknown segment folder holds an index file', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cart/services/index.ts',
      'src/entities/cart/model',
      defaultConfig,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: true,
      currentSegment: 'services',
      targetSegment: 'model',
    });
  });

  it('should detect cross-segment when the target of an unknown segment folder is a file', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cart/services/index.ts',
      'src/entities/cart/helpers.ts',
      defaultConfig,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: true,
      currentSegment: 'services',
      targetSegment: 'helpers',
    });
  });
  it('reads the configured segments, so a custom segment folder anchors the slice', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cart/services/helpers/index.ts',
      'src/entities/cart/model',
      defaultConfig,
      [...DEFAULT_SEGMENTS, 'services'],
    );

    expect(result).toEqual({
      isCrossSegmentReexport: true,
      currentSegment: 'services',
      targetSegment: 'model',
    });
  });

  it('takes the segment after the resolved slice when the filesystem answered', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cluster/i18n/nested/index.ts',
      'src/entities/cluster/api',
      defaultConfig,
      undefined,
      { slice: 'cluster', index: 0 },
    );

    expect(result).toEqual({
      isCrossSegmentReexport: true,
      currentSegment: 'i18n',
      targetSegment: 'api',
    });
  });

  it('keeps its own derivation when the filesystem did not answer', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cluster/i18n/index.ts',
      'src/entities/cluster/api',
      defaultConfig,
      undefined,
      null,
    );

    expect(result).toEqual({
      isCrossSegmentReexport: true,
      currentSegment: 'i18n',
      targetSegment: 'api',
    });
  });
  it('does not treat the cross-import public api folder of the resolved slice as a segment', () => {
    const result = isCrossSegmentReexport(
      'src/entities/user/@x/session.ts',
      'src/entities/user/model/create-user',
      defaultConfig,
      undefined,
      { slice: 'user', index: 0 },
    );

    expect(result).toEqual({
      isCrossSegmentReexport: false,
      currentSegment: null,
      targetSegment: null,
    });
  });
  it('takes a segment written as a file after the resolved slice when it carries a segment name', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cluster/model.ts',
      'src/entities/cluster/api',
      defaultConfig,
      undefined,
      { slice: 'cluster', index: 0 },
    );

    expect(result).toEqual({
      isCrossSegmentReexport: true,
      currentSegment: 'model',
      targetSegment: 'api',
    });
  });

  it('does not take a file after the resolved slice whose name is not a segment name', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cart/cart-service.ts',
      'src/entities/cart/helpers',
      defaultConfig,
      undefined,
      { slice: 'cart', index: 0 },
    );

    expect(result).toEqual({
      isCrossSegmentReexport: false,
      currentSegment: null,
      targetSegment: null,
    });
  });

  it('finds the resolved slice below a group folder rather than at the first part', () => {
    const result = isCrossSegmentReexport(
      'src/entities/group/User/model/index.ts',
      'src/entities/group/User/api',
      defaultConfig,
      undefined,
      { slice: 'User', index: 1 },
    );

    expect(result).toEqual({
      isCrossSegmentReexport: true,
      currentSegment: 'model',
      targetSegment: 'api',
    });
  });

  it('returns nothing when the resolved slice is not one of the parts below the layer', () => {
    const result = isCrossSegmentReexport(
      'src/entities/cluster/model/index.ts',
      'src/entities/cluster/api',
      defaultConfig,
      undefined,
      { slice: 'nowhere', index: 0 },
    );

    expect(result).toEqual({
      isCrossSegmentReexport: false,
      currentSegment: null,
      targetSegment: null,
    });
  });

  /*
   * The boundary is a position. A slice that holds a folder of its own name carries the name
   * twice below the layer, and a search by name stops at the folder above the slice, which
   * takes the slice prefix with it and hides every segment of the real slice.
   */
  it('takes the segment at the boundary rather than after the first folder of the same name', () => {
    const result = isCrossSegmentReexport(
      'src/entities/panel/panel/ui/index.ts',
      'src/entities/panel/panel/model',
      defaultConfig,
      undefined,
      { slice: 'panel', index: 1 },
    );

    expect(result).toEqual({
      isCrossSegmentReexport: true,
      currentSegment: 'ui',
      targetSegment: 'model',
    });
  });

  it('reads the public api of a slice below a folder of its own name as carrying no segment', () => {
    const result = isCrossSegmentReexport(
      'src/entities/panel/panel/index.ts',
      'src/entities/panel/panel/model',
      defaultConfig,
      undefined,
      { slice: 'panel', index: 1 },
    );

    expect(result).toEqual({
      isCrossSegmentReexport: false,
      currentSegment: null,
      targetSegment: null,
    });
  });
});
