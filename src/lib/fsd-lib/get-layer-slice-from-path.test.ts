import { layersWithoutSlices } from '../../config';
import { getLayerSliceFromPath } from './get-layer-slice-from-path';

const FSD_LAYERS_WITHOUT_SLICES = layersWithoutSlices;

const layerCases = [
  {
    path: 'src/entities/foo',
    expected: 'entities',
  },
  {
    path: 'some/long/root/path/entities/foo',
    expected: 'entities',
  },
  // {
  //   name: 'should correct return layer if path contain multiple layer names',
  //   path: 'src/processes/shared/index.ts',
  //   expected: 'processes',
  // },
  {
    path: 'entities/foo',
    expected: 'entities',
  },
  {
    path: 'EntitiEs/foo',
    expected: 'entities',
  },
  {
    path: './index.ts',
    expected: null,
  },
  {
    path: './app.ts',
    expected: null,
  },
  {
    path: './entitiesInName.ts',
    expected: null,
  },
];

const shouldNotReturnSliceFromLayersWithoutSlices = FSD_LAYERS_WITHOUT_SLICES.map((layer) => ({
  name: `should not return slice from layer that can not contain slices ("${layer}")`,
  path: `src/${layer}/foo/index.ts`,
  expected: null,
}));

const sliceCases = [
  ...shouldNotReturnSliceFromLayersWithoutSlices,
  {
    path: 'src/entities/foo',
    expected: 'foo',
  },
  {
    path: 'entities/foo',
    expected: 'foo',
  },
  {
    path: 'entities/foo/bar/baz',
    expected: 'foo',
  },
  {
    path: 'some/long/path/entities/foo/bar/baz',
    expected: 'foo',
  },
  {
    path: 'some/long/path/entities/foo/bar/baz.tsx',
    expected: 'foo',
  },
  {
    path: 'src/app/App.tsx',
    expected: null,
  },
  {
    path: 'src/app',
    expected: null,
  },
  {
    path: '/Users/conarti/Projects/feature-sliced-frontend/src/entities/foo-bar-baz/ui/index.vue',
    expected: 'foo-bar-baz',
  },
];

describe('get-layer-slice-from-path', () => {
  it.each(layerCases)('should correct return layer %#', ({
    path,
    expected,
  }) => {
    const [actual] = getLayerSliceFromPath(path);
    expect(actual).toBe(expected);
  });

  it.each(sliceCases)('should correct return slice %#', ({
    path,
    expected,
  }) => {
    const [, actual] = getLayerSliceFromPath(path);
    expect(actual).toBe(expected);
  });
});
