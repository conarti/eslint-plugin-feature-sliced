import { describe, expect, it } from 'vitest';
import {
  containsOther,
  isCrossImportFileTargetingOwnSlice,
  sliceDirParts,
} from './slice-containment';

describe('sliceDirParts', () => {
  it('returns null when the path holds no layer that can contain slices', () => {
    expect(sliceDirParts('src/utils/helpers/thing.ts')).toBeNull();
  });

  it('returns null when nothing follows the layer', () => {
    expect(sliceDirParts('src/entities')).toBeNull();
  });

  it('returns the parts from the layer onward, lowercased', () => {
    expect(sliceDirParts('/proj/src/Entities/Foo/Model/Thing.ts')).toEqual([
      'entities',
      'foo',
      'model',
      'thing.ts',
    ]);
  });

  it('reads an aliased path the same way as an absolute one', () => {
    expect(sliceDirParts('@/entities/foo/model/thing')).toEqual([
      'entities',
      'foo',
      'model',
      'thing',
    ]);
  });

  it('drops empty parts', () => {
    expect(sliceDirParts('src//entities//foo/')).toEqual(['entities', 'foo']);
  });

  it('does not treat a layer without slices as the layer boundary', () => {
    const layersConfig = [
      { name: 'shared', hasSlices: false },
      { name: 'entities', hasSlices: true },
    ];

    expect(sliceDirParts('src/shared/lib/thing.ts', layersConfig)).toBeNull();
    expect(sliceDirParts('src/shared/entities/foo/thing.ts', layersConfig)).toEqual([
      'entities',
      'foo',
      'thing.ts',
    ]);
  });

  it('uses the configured layer names', () => {
    const layersConfig = [{ name: 'modules', hasSlices: true }];

    expect(sliceDirParts('src/modules/foo/model', layersConfig)).toEqual(['modules', 'foo', 'model']);
    expect(sliceDirParts('src/entities/foo/model', layersConfig)).toBeNull();
  });
});

describe('containsOther', () => {
  it('is true when the first parts are a proper prefix of the second', () => {
    expect(containsOther(['entities', 'foo'], ['entities', 'foo', 'model', 'thing'])).toBe(true);
  });

  it('is false for equal parts', () => {
    expect(containsOther(['entities', 'foo'], ['entities', 'foo'])).toBe(false);
  });

  it('is false when the first parts are longer', () => {
    expect(containsOther(['entities', 'foo', 'model'], ['entities', 'foo'])).toBe(false);
  });

  it('is false when the parts diverge', () => {
    expect(containsOther(['entities', 'foo'], ['entities', 'other', 'model'])).toBe(false);
  });

  it('does not treat one slice name as a prefix of a longer one', () => {
    expect(containsOther(['entities', 'user'], ['entities', 'user-profile', 'model'])).toBe(false);
  });
});

describe('isCrossImportFileTargetingOwnSlice', () => {
  it('is true when the target stays inside the slice that holds the @x folder', () => {
    expect(isCrossImportFileTargetingOwnSlice(
      'src/entities/foo/@x/bar.ts',
      'src/entities/foo/model/thing',
    )).toBe(true);
  });

  it('is true for an aliased target inside the same slice', () => {
    expect(isCrossImportFileTargetingOwnSlice(
      'src/entities/foo/@x/bar.ts',
      '@/entities/foo/model/thing',
    )).toBe(true);
  });

  it('is true whatever the case of either side', () => {
    expect(isCrossImportFileTargetingOwnSlice(
      'src/Entities/Foo/@x/bar.ts',
      '@/entities/foo/model/thing',
    )).toBe(true);
  });

  it('is false when the target belongs to another slice', () => {
    expect(isCrossImportFileTargetingOwnSlice(
      'src/entities/foo/@x/bar.ts',
      'src/entities/other/model/thing',
    )).toBe(false);
  });

  it('is false when the current file holds no @x folder', () => {
    expect(isCrossImportFileTargetingOwnSlice(
      'src/entities/foo/model/bar.ts',
      'src/entities/foo/model/thing',
    )).toBe(false);
  });

  it('is false when the current file holds no layer', () => {
    expect(isCrossImportFileTargetingOwnSlice(
      'src/utils/@x/bar.ts',
      'src/entities/foo/model/thing',
    )).toBe(false);
  });

  it('is false when the target holds no layer', () => {
    expect(isCrossImportFileTargetingOwnSlice(
      'src/entities/foo/@x/bar.ts',
      'src/utils/thing',
    )).toBe(false);
  });
});
