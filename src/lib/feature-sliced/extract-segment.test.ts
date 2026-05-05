import {
  DEFAULT_SEGMENTS,
  layersWithoutSlices,
  segments,
} from '../../config';
import { extractSegment } from './extract-segment';

const FSD_SEGMENTS = segments;
const FSD_LAYERS_WITHOUT_SLICES = layersWithoutSlices;
const CUSTOM_SEGMENTS = [...DEFAULT_SEGMENTS, 'services', 'hooks'];

describe('extract-segment', () => {
  interface TestCase {
    name: string;
    path: string;
    expected: ReturnType<typeof extractSegment>;
  };

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
    const actual = extractSegment(path);
    expect(actual).toStrictEqual(expected);
  });

  describe('with custom segments config', () => {
    it('should recognize custom segment when provided in config', () => {
      const result = extractSegment(
        'src/entities/foo/services/index.ts',
        undefined,
        CUSTOM_SEGMENTS,
      );
      expect(result).toStrictEqual(['services', 'index.ts']);
    });

    it('should recognize another custom segment', () => {
      const result = extractSegment(
        'src/features/bar/hooks/useAuth.ts',
        undefined,
        CUSTOM_SEGMENTS,
      );
      expect(result).toStrictEqual(['hooks', 'useAuth.ts']);
    });

    it('should still recognize default segments with custom config', () => {
      const result = extractSegment(
        'src/entities/foo/ui/Button.tsx',
        undefined,
        CUSTOM_SEGMENTS,
      );
      expect(result).toStrictEqual(['ui', 'Button.tsx']);
    });

    it('should not recognize unknown segment even with custom config', () => {
      const result = extractSegment(
        'src/entities/foo/unknown/index.ts',
        undefined,
        CUSTOM_SEGMENTS,
      );
      expect(result).toStrictEqual([null, null]);
    });

    it('should work with replace mode (only custom segments)', () => {
      const replaceSegments = ['services', 'stores'];
      const result = extractSegment(
        'src/entities/foo/services/index.ts',
        undefined,
        replaceSegments,
      );
      expect(result).toStrictEqual(['services', 'index.ts']);
    });

    it('should not recognize default segment in replace mode if not included', () => {
      const replaceSegments = ['services', 'stores'];
      const result = extractSegment(
        'src/entities/foo/ui/Button.tsx',
        undefined,
        replaceSegments,
      );
      expect(result).toStrictEqual([null, null]);
    });

    it('should work with custom segments as folder', () => {
      const result = extractSegment(
        'src/features/auth/services',
        undefined,
        CUSTOM_SEGMENTS,
      );
      expect(result).toStrictEqual(['services', null]);
    });

    it('should work with custom segments as file', () => {
      const result = extractSegment(
        'src/features/auth/services.ts',
        undefined,
        CUSTOM_SEGMENTS,
      );
      expect(result).toStrictEqual(['services', null]);
    });
  });
});
