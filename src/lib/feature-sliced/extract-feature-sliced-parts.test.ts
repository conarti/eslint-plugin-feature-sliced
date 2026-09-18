import {
  extractFeatureSlicedParts,
  withFallbackSlice,
} from './extract-feature-sliced-parts';

/*
 * The combined extractor is exercised through the rule suites, but the fallback record it
 * carries is not: the never-mix rewrite in `extract-paths-info.ts` reads it, and a resolution
 * that forgot to fill it in would look identical from there.
 */
describe('extract-feature-sliced-parts', () => {
  const ROOT = '/proj';

  it('carries the path heuristic answers when nothing was resolved', () => {
    const parts = extractFeatureSlicedParts('/proj/src/widgets/header/hooks/use-x.ts', ROOT);

    expect(parts).toEqual({
      layer: 'widgets',
      slice: 'hooks',
      segment: null,
      segmentFiles: null,
      resolved: false,
      fallback: { slice: 'hooks', segment: null, segmentFiles: null },
    });
  });

  it('carries both answers when the filesystem resolved the boundary', () => {
    const parts = extractFeatureSlicedParts('/proj/src/widgets/header/hooks/use-x.ts', ROOT, {
      hasPublicApi: (directory) => directory === '/proj/src/widgets/header',
    });

    expect(parts).toEqual({
      layer: 'widgets',
      slice: 'header',
      segment: 'hooks',
      segmentFiles: 'use-x.ts',
      resolved: true,
      fallback: { slice: 'hooks', segment: null, segmentFiles: null },
    });
  });

  it('resolves the slice from the slice path, which is also what the fallback reads', () => {
    const parts = extractFeatureSlicedParts('@/widgets/header/hooks/use-x', ROOT, {
      slicePath: '/proj/src/widgets/header/hooks/use-x',
      hasPublicApi: (directory) => directory === '/proj/src/widgets/header',
    });

    expect(parts.slice).toBe('header');
    expect(parts.resolved).toBe(true);
    expect(parts.fallback.slice).toBe('use-x');
  });

  it('takes the slice, the segment and the segment files back to the path heuristic together', () => {
    const parts = extractFeatureSlicedParts('/proj/src/widgets/header/hooks/use-x.ts', ROOT, {
      hasPublicApi: (directory) => directory === '/proj/src/widgets/header',
    });

    expect(withFallbackSlice(parts)).toEqual({
      ...parts,
      slice: 'hooks',
      segment: null,
      segmentFiles: null,
    });
  });
});
