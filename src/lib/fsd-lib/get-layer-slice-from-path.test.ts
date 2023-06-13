import { getLayerSliceFromPath } from './get-layer-slice-from-path';

describe('get-layer-slice-from-path', () => {
  it('should return layer 1', () => {
    const path = 'src/entities/foo';
    const expectedLayer = 'entities';
    const [actualLayer] = getLayerSliceFromPath(path);

    expect(actualLayer).toStrictEqual(expectedLayer);
  });

  it('should return layer 2', () => {
    const path = 'some/long/root/path/entities/foo';
    const expectedLayer = 'entities';
    const [actualLayer] = getLayerSliceFromPath(path);

    expect(actualLayer).toStrictEqual(expectedLayer);
  });

  it('should return layer 3', () => {
    const path = 'entities/foo';
    const expectedLayer = 'entities';
    const [actualLayer] = getLayerSliceFromPath(path);

    expect(actualLayer).toStrictEqual(expectedLayer);
  });

  it('should return layer 4', () => {
    const path = 'EntitiEs/foo';
    const expectedLayer = 'entities';
    const [actualLayer] = getLayerSliceFromPath(path);

    expect(actualLayer).toStrictEqual(expectedLayer);
  });

  it('should not return layer 1', () => {
    const path = './index.ts';
    const expectedLayer = null;
    const [actualLayer] = getLayerSliceFromPath(path);

    expect(actualLayer).toStrictEqual(expectedLayer);
  });

  it('should not return layer 2', () => {
    const path = './app.ts';
    const expectedLayer = null;
    const [actualLayer] = getLayerSliceFromPath(path);

    expect(actualLayer).toStrictEqual(expectedLayer);
  });

  it('should not return layer 3', () => {
    const path = './entitiesInName.ts';
    const expectedLayer = null;
    const [actualLayer] = getLayerSliceFromPath(path);

    expect(actualLayer).toStrictEqual(expectedLayer);
  });

  it('should return slice 1', () => {
    const path = 'src/entities/foo';
    const expectedSlice = 'foo';
    const [, actualSlice] = getLayerSliceFromPath(path);

    expect(actualSlice).toStrictEqual(expectedSlice);
  });

  it('should return slice 2', () => {
    const path = 'entities/foo';
    const expectedSlice = 'foo';
    const [, actualSlice] = getLayerSliceFromPath(path);

    expect(actualSlice).toStrictEqual(expectedSlice);
  });

  it('should return slice 3', () => {
    const path = 'entities/foo/bar/baz';
    const expectedSlice = 'foo';
    const [, actualSlice] = getLayerSliceFromPath(path);

    expect(actualSlice).toStrictEqual(expectedSlice);
  });

  it('should return slice 4', () => {
    const path = 'some/long/path/entities/foo/bar/baz';
    const expectedSlice = 'foo';
    const [, actualSlice] = getLayerSliceFromPath(path);

    expect(actualSlice).toStrictEqual(expectedSlice);
  });

  it('should return slice 5', () => {
    const path = 'some/long/path/entities/foo/bar/baz.tsx';
    const expectedSlice = 'foo';
    const [, actualSlice] = getLayerSliceFromPath(path);

    expect(actualSlice).toStrictEqual(expectedSlice);
  });

  it('should not return slice 6', () => {
    const path = 'src/app/App.tsx';
    const expectedSlice = null;
    const [, actualSlice] = getLayerSliceFromPath(path);

    expect(actualSlice).toStrictEqual(expectedSlice);
  });

  it('should not return slice 7', () => {
    const path = 'src/app';
    const expectedSlice = null;
    const [, actualSlice] = getLayerSliceFromPath(path);

    expect(actualSlice).toStrictEqual(expectedSlice);
  });

  it('should not return slice 8 (kebab-case)', () => {
    const path = '/Users/conarti/Projects/feature-sliced-frontend/src/entities/foo-bar-baz/ui/index.vue';
    const expectedSlice = 'foo-bar-baz';
    const [, actualSlice] = getLayerSliceFromPath(path);

    expect(actualSlice).toStrictEqual(expectedSlice);
  });
});
