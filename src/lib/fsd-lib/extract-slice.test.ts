import { layersWithoutSlices } from '../../config';
import { extractSlice } from './extract-slice';

const FSD_LAYERS_WITHOUT_SLICES = layersWithoutSlices;

describe('extract-slice', () => {
  const shouldNotReturnSliceFromLayersWithoutSlices = FSD_LAYERS_WITHOUT_SLICES.map((layer) => ({
    name: `should not return slice from layer that can not contain slices ("${layer}")`,
    path: `src/${layer}/foo/index.ts`,
    expected: null,
  }));

  const cases = [
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

  it.each(cases)('$path', ({
    path,
    expected,
  }) => {
    const actual = extractSlice(path);
    expect(actual).toBe(expected);
  });
});
