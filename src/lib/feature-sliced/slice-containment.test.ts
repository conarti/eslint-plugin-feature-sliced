import { describe, expect, it } from 'vitest';
import {
  containsOther,
  isCrossImportFileTargetingOwnSlice,
  sliceDirParts,
  staysInsideOneSlice,
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

  it('is false when the @x folder sits directly on the layer', () => {
    expect(isCrossImportFileTargetingOwnSlice(
      'src/entities/@x/bar.ts',
      '@/entities/other/model/secret',
    )).toBe(false);
  });

  it('is false when the @x folder sits directly on the layer and the file is in a segment', () => {
    expect(isCrossImportFileTargetingOwnSlice(
      'src/entities/@x/model/thing.ts',
      '@/entities/other/model/secret',
    )).toBe(false);
  });

  /*
   * [GF] A folder between the layer and @x is read as the slice that holds it, so this
   * pair is silent today. Whether "group" is a slice or a group folder cannot be told
   * from the path, and step B5 is the only step allowed to change what this expects.
   */
  it('[GF] reads the folder between the layer and @x as the slice holding it', () => {
    expect(isCrossImportFileTargetingOwnSlice(
      'src/entities/group/@x/bar.ts',
      '@/entities/group/other/model/x',
    )).toBe(true);
  });
});

describe('staysInsideOneSlice', () => {
  it('is true when the target stays inside the slice directory of the current file', () => {
    expect(staysInsideOneSlice(
      { path: 'src/widgets/header/Header.ts', slice: 'header' },
      { path: '@/widgets/header/hooks', slice: 'hooks' },
    )).toBe(true);
  });

  it('is true in the reverse direction, when the current file sits deeper than the target slice', () => {
    expect(staysInsideOneSlice(
      { path: 'src/features/leaderboard/actions/get-top.ts', slice: 'actions' },
      { path: '@/features/leaderboard/lib/utils', slice: 'leaderboard' },
    )).toBe(true);
  });

  it('is true whatever the case of the slice name', () => {
    expect(staysInsideOneSlice(
      { path: 'src/entities/Group/UserA/ui/a.ts', slice: 'UserA' },
      { path: '@/entities/Group/UserA/hooks', slice: 'hooks' },
    )).toBe(true);
  });

  it('is false for two different slices under the same layer', () => {
    expect(staysInsideOneSlice(
      { path: 'src/widgets/header/Header.ts', slice: 'header' },
      { path: '@/widgets/footer/hooks', slice: 'hooks' },
    )).toBe(false);
  });

  it('is false for two slices that share a name prefix', () => {
    expect(staysInsideOneSlice(
      { path: 'src/entities/user/model/a.ts', slice: 'user' },
      { path: '@/entities/user-profile/model/x', slice: 'user-profile' },
    )).toBe(false);
  });

  it('does not read the layer itself as the slice when the two share a name', () => {
    expect(staysInsideOneSlice(
      { path: 'src/entities/entities/model/a.ts', slice: 'entities' },
      { path: '@/entities/other/model/x', slice: 'other' },
    )).toBe(false);
  });

  it('is false when the current file holds no slice', () => {
    expect(staysInsideOneSlice(
      { path: 'src/entities/foo/model/a.ts', slice: null },
      { path: '@/entities/foo/hooks', slice: 'hooks' },
    )).toBe(false);
  });

  it('is false when the target holds no slice', () => {
    expect(staysInsideOneSlice(
      { path: 'src/entities/foo/model/a.ts', slice: 'foo' },
      { path: '@/entities/foo/hooks', slice: null },
    )).toBe(false);
  });

  it('is false when the current file holds no layer', () => {
    expect(staysInsideOneSlice(
      { path: 'src/utils/helpers/a.ts', slice: 'helpers' },
      { path: '@/entities/foo/hooks', slice: 'hooks' },
    )).toBe(false);
  });

  it('is false when the target holds no layer', () => {
    expect(staysInsideOneSlice(
      { path: 'src/entities/foo/model/a.ts', slice: 'foo' },
      { path: 'src/utils/helpers', slice: 'helpers' },
    )).toBe(false);
  });

  it('is false when the slice name is absent from the parts of its own path', () => {
    expect(staysInsideOneSlice(
      { path: 'src/entities/foo/model/a.ts', slice: 'ghost' },
      { path: '@/entities/foo/hooks', slice: 'hooks' },
    )).toBe(false);
  });

  it('is false when the layer of the current file cannot contain slices', () => {
    const layersConfig = [
      { name: 'shared', hasSlices: false },
      { name: 'entities', hasSlices: true },
    ];

    expect(staysInsideOneSlice(
      { path: 'src/shared/lib/a.ts', slice: 'lib' },
      { path: '@/shared/lib/helpers', slice: 'helpers' },
      layersConfig,
    )).toBe(false);
  });

  it('uses the configured layer names', () => {
    const layersConfig = [{ name: 'modules', hasSlices: true }];

    expect(staysInsideOneSlice(
      { path: 'src/modules/header/Header.ts', slice: 'header' },
      { path: '@/modules/header/hooks', slice: 'hooks' },
      layersConfig,
    )).toBe(true);
    expect(staysInsideOneSlice(
      { path: 'src/entities/header/Header.ts', slice: 'header' },
      { path: '@/entities/header/hooks', slice: 'hooks' },
      layersConfig,
    )).toBe(false);
  });
});
