import { layersWithoutSlices, segments } from '../../config';
import { extractSegments } from './extract-segments';

const FSD_SEGMENTS = segments;
const FSD_LAYERS_WITHOUT_SLICES = layersWithoutSlices;

describe('extract-segments', () => {
  type TestCase = {
    name: string;
    path: string;
    expected: ReturnType<typeof extractSegments>
  }

  const shouldUnderstandAllFsdSegmentsTestCases: TestCase[] = FSD_SEGMENTS.map((segment) => ({
    name: `should return "${segment}" segment`,
    path: `src/entities/foo/${segment}`,
    expected: [segment, null],
  }));

  const shouldNotReturnIfLayerCanNotContainSlices: TestCase[] = FSD_LAYERS_WITHOUT_SLICES.map((layer) => ({
    name: `should not return segment and files from layers that can not contain slices (${layer})`,
    path: `src/${layer}/foo/ui/index.ts`,
    expected: [null, null],
  }));

  const cases: TestCase[] = [
    ...shouldUnderstandAllFsdSegmentsTestCases,
    ...shouldNotReturnIfLayerCanNotContainSlices,
    {
      name: 'should return [null, null] if path is empty',
      path: '',
      expected: [null, null],
    },
    {
      name: 'should not return unknown segment',
      path: 'src/entities/foo/custom-segment',
      expected: [null, null],
    },
    {
      name: 'should not return files of unknown segment',
      path: 'src/entities/foo/custom-segment/index.ts',
      expected: [null, null],
    },
    {
      name: 'should return segment and files of it',
      path: 'src/entities/foo/ui/index.ts',
      expected: ['ui', 'index.ts'],
    },
    {
      name: 'should work with absolute root paths',
      path: '/Users/test/Projects/project/src/entities/foo/ui/index.ts',
      expected: ['ui', 'index.ts'],
    },
    {
      name: 'should correct return segment if project has layer name',
      path: 'widgets/src/entities/foo/ui/index.ts',
      expected: ['ui', 'index.ts'],
    },
    {
      name: 'should not return segment and segment files if it has not segment',
      path: 'src/entities/foo/index.ts',
      expected: [null, null],
    },
    {
      name: 'should return segment and files if it has group folders',
      path: 'src/entities/group-folder/foo/model/index.ts',
      expected: ['model', 'index.ts'],
    },
    {
      name: 'should return segment and files if it has sub-groups in segment',
      path: 'src/entities/foo/model/sub-folder/sub-sub-folder/index.ts',
      expected: ['model', 'sub-folder/sub-sub-folder/index.ts'],
    },
    {
      name: 'should return only segment if it does not has any segment files',
      path: 'src/entities/foo/model',
      expected: ['model', null],
    },
    {
      name: 'should return segment if it is a file',
      path: 'src/entities/foo/model.ts',
      expected: ['model', null],
    },
    {
      name: 'should return segment if slice contain segment in own name',
      path: 'src/entities/foo-ui/lib/index.ts',
      expected: ['lib', 'index.ts'],
    },
    {
      name: 'should return segment if slice has segment name (slice = "ui")',
      path: 'src/entities/ui/lib/index.ts',
      expected: ['lib', 'index.ts'],
    },
    {
      name: 'should not return segment and files if it has unknown layer',
      path: 'src/custom-layer/ui/lib/index.ts',
      expected: [null, null],
    },
  ];

  it.each(cases)('$name', ({
    path,
    expected,
  }) => {
    const actual = extractSegments(path);
    expect(actual).toStrictEqual(expected);
  });
});
