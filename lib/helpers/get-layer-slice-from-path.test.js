const assert = require('assert');
const { getLayerSliceFromPath } = require('./get-layer-slice-from-path');

describe('get-layer-slice-from-path', () => {
  it('should return layer 1', () => {
    const path = 'src/entities/foo';
    const expectedLayer = 'entities';
    const [actualLayer] = getLayerSliceFromPath(path);

    assert.strictEqual(actualLayer, expectedLayer);
  });

  it('should return layer 2', () => {
    const path = 'some/long/root/path/entities/foo';
    const expectedLayer = 'entities';
    const [actualLayer] = getLayerSliceFromPath(path);

    assert.strictEqual(actualLayer, expectedLayer);
  });

  it('should return layer 3', () => {
    const path = 'entities/foo';
    const expectedLayer = 'entities';
    const [actualLayer] = getLayerSliceFromPath(path);

    assert.strictEqual(actualLayer, expectedLayer);
  });

  it('should return slice 1', () => {
    const path = 'src/entities/foo';
    const expectedSlice = 'foo';
    const [, actualSlice] = getLayerSliceFromPath(path);

    assert.strictEqual(actualSlice, expectedSlice);
  });

  it('should return slice 2', () => {
    const path = 'entities/foo';
    const expectedSlice = 'foo';
    const [, actualSlice] = getLayerSliceFromPath(path);

    assert.strictEqual(actualSlice, expectedSlice);
  });

  it('should return slice 3', () => {
    const path = 'entities/foo/bar/baz';
    const expectedSlice = 'foo';
    const [, actualSlice] = getLayerSliceFromPath(path);

    assert.strictEqual(actualSlice, expectedSlice);
  });

  it('should return slice 4', () => {
    const path = 'some/long/path/entities/foo/bar/baz';
    const expectedSlice = 'foo';
    const [, actualSlice] = getLayerSliceFromPath(path);

    assert.strictEqual(actualSlice, expectedSlice);
  });

  it('should return slice 5', () => {
    const path = 'some/long/path/entities/foo/bar/baz.tsx';
    const expectedSlice = 'foo';
    const [, actualSlice] = getLayerSliceFromPath(path);

    assert.strictEqual(actualSlice, expectedSlice);
  });

  it('should not return slice 1', () => {
    const path = 'src/app/App.tsx';
    const expectedSlice = null;
    const [, actualSlice] = getLayerSliceFromPath(path);

    assert.strictEqual(actualSlice, expectedSlice);
  });

  it('should not return slice 2', () => {
    const path = 'src/app';
    const expectedSlice = null;
    const [, actualSlice] = getLayerSliceFromPath(path);

    assert.strictEqual(actualSlice, expectedSlice);
  });
});
