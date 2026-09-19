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

  /*
   * The positional route, taken whenever the filesystem resolved the slice boundary. The
   * configured name list stops deciding what a segment is; the first part after the slice is
   * the segment, whatever it is called.
   */
  describe('with a resolved slice boundary', () => {
    it('takes the first part after the slice as the segment', () => {
      expect(extractSegment('src/entities/foo/ui/index.ts', undefined, undefined, { slice: 'foo', index: 0 }))
        .toStrictEqual(['ui', 'index.ts']);
    });

    it('takes a folder that is absent from the segment list', () => {
      expect(extractSegment('src/entities/foo/custom-segment/index.ts', undefined, undefined, { slice: 'foo', index: 0 }))
        .toStrictEqual(['custom-segment', 'index.ts']);
    });

    it('takes the part after the slice through a group folder', () => {
      expect(extractSegment('src/entities/group-folder/foo/model/index.ts', undefined, undefined, { slice: 'foo', index: 1 }))
        .toStrictEqual(['model', 'index.ts']);
    });

    it('takes the part after the slice through a parenthesized group folder', () => {
      expect(extractSegment('src/entities/(group-folder)/foo/model/index.ts', undefined, undefined, { slice: 'foo', index: 1 }))
        .toStrictEqual(['model', 'index.ts']);
    });

    it('keeps every part below the segment as the segment files', () => {
      expect(extractSegment('src/entities/foo/model/sub-folder/sub-sub-folder/index.ts', undefined, undefined, { slice: 'foo', index: 0 }))
        .toStrictEqual(['model', 'sub-folder/sub-sub-folder/index.ts']);
    });

    it('drops the extension of a segment written as a file', () => {
      expect(extractSegment('src/entities/foo/model.ts', undefined, undefined, { slice: 'foo', index: 0 }))
        .toStrictEqual(['model', null]);
    });

    it('returns nothing for the slice public api itself', () => {
      expect(extractSegment('src/entities/foo/index.ts', undefined, undefined, { slice: 'foo', index: 0 }))
        .toStrictEqual([null, null]);
    });

    it('returns nothing for the cross-import public api folder', () => {
      expect(extractSegment('src/entities/foo/@x/session', undefined, undefined, { slice: 'foo', index: 0 }))
        .toStrictEqual([null, null]);
    });

    it('returns nothing when nothing follows the slice', () => {
      expect(extractSegment('src/entities/foo', undefined, undefined, { slice: 'foo', index: 0 }))
        .toStrictEqual([null, null]);
    });

    it('returns nothing when the path holds no layer', () => {
      expect(extractSegment('src/components/foo/ui', undefined, undefined, { slice: 'foo', index: 0 }))
        .toStrictEqual([null, null]);
    });

    /*
     * The boundary counts from the layer, so a path with no layer has no position to count
     * from and no segment to give, even when the part the boundary names happens to sit there.
     */
    it('returns nothing when the path holds no layer and the boundary points at a part that is there', () => {
      expect(extractSegment('components/foo/ui/x.ts', undefined, undefined, { slice: 'components', index: 0 }))
        .toStrictEqual([null, null]);
    });

    it('returns nothing when the slice is not one of the parts after the layer', () => {
      expect(extractSegment('src/entities/bar/ui/index.ts', undefined, undefined, { slice: 'foo', index: 0 }))
        .toStrictEqual([null, null]);
    });

    it('matches the slice name case-insensitively', () => {
      expect(extractSegment('src/entities/Foo/ui/index.ts', undefined, undefined, { slice: 'foo', index: 0 }))
        .toStrictEqual(['ui', 'index.ts']);
    });
    it('reads a folder whose name only starts with index as a segment', () => {
      expect(extractSegment('src/entities/foo/indexes/x.ts', undefined, undefined, { slice: 'foo', index: 0 }))
        .toStrictEqual(['indexes', 'x.ts']);
    });

    it('reads a file whose name only ends with an index name as a segment', () => {
      expect(extractSegment('src/entities/foo/my-index.ts', undefined, undefined, { slice: 'foo', index: 0 }))
        .toStrictEqual(['my-index', null]);
    });

    it('returns nothing for a bare index entry carrying no extension', () => {
      expect(extractSegment('src/entities/foo/index', undefined, undefined, { slice: 'foo', index: 0 }))
        .toStrictEqual([null, null]);
    });

    it('drops only the last extension of a segment file carrying several', () => {
      expect(extractSegment('src/entities/foo/model.spec.ts', undefined, undefined, { slice: 'foo', index: 0 }))
        .toStrictEqual(['model.spec', null]);
    });

    it('ignores empty parts left by a doubled slash', () => {
      expect(extractSegment('src/entities/foo//ui/x.ts', undefined, undefined, { slice: 'foo', index: 0 }))
        .toStrictEqual(['ui', 'x.ts']);
    });

    it('looks for the slice below the layer, not anywhere in the path', () => {
      expect(extractSegment('foo/entities/foo/ui/index.ts', undefined, undefined, { slice: 'foo', index: 0 }))
        .toStrictEqual(['ui', 'index.ts']);
    });

    /*
     * The boundary is a position. A slice that holds a folder of its own name carries the
     * name twice after the layer, and which of the two the resolver settled on is exactly
     * what a search by name cannot recover.
     */
    it('takes the segment at the boundary rather than after the first folder of the same name', () => {
      expect(extractSegment('src/entities/user/user/a.ts', undefined, undefined, { slice: 'user', index: 1 }))
        .toStrictEqual(['a', null]);
    });

    it('reads the public api of a slice below a folder of its own name as carrying no segment', () => {
      expect(extractSegment('src/entities/user/user/index.ts', undefined, undefined, { slice: 'user', index: 1 }))
        .toStrictEqual([null, null]);
    });

    it('takes the segment after the outer folder when that is the one the resolver settled on', () => {
      expect(extractSegment('src/entities/user/user/a.ts', undefined, undefined, { slice: 'user', index: 0 }))
        .toStrictEqual(['user', 'a.ts']);
    });

    it('returns nothing when the boundary points past the end of the path', () => {
      expect(extractSegment('src/entities/foo/ui/index.ts', undefined, undefined, { slice: 'foo', index: 9 }))
        .toStrictEqual([null, null]);
    });

    it('takes the name list route when the slice is explicitly unresolved', () => {
      expect(extractSegment('src/entities/foo/custom-segment/index.ts', undefined, undefined, null))
        .toStrictEqual([null, null]);
    });

    /*
     * Nothing forbids holding several checkouts in a folder named after a layer, and the rules
     * only ever see absolute paths. The boundary counts from the project's own layer, so the
     * search for that layer has to start below the project root; an ancestor of the same name
     * would otherwise answer first and every position below it would be off.
     */
    describe('under a project root', () => {
      it('finds the layer below the root rather than in an ancestor of the same name', () => {
        expect(extractSegment(
          '/checkout/entities/proj/src/entities/foo/ui/index.ts',
          undefined,
          undefined,
          { slice: 'foo', index: 0 },
          '/checkout/entities/proj',
        )).toStrictEqual(['ui', 'index.ts']);
      });

      it('counts the boundary from the layer below the root through a group folder', () => {
        expect(extractSegment(
          '/checkout/pages/proj/src/pages/(group)/foo/model/index.ts',
          undefined,
          undefined,
          { slice: 'foo', index: 1 },
          '/checkout/pages/proj',
        )).toStrictEqual(['model', 'index.ts']);
      });

      /* The guarded case: a slice named after its own layer still has to be read by position */
      it('keeps taking the segment at the boundary when the slice carries the layer name', () => {
        expect(extractSegment(
          '/checkout/entities/proj/src/entities/entities/ui/a.ts',
          undefined,
          undefined,
          { slice: 'entities', index: 0 },
          '/checkout/entities/proj',
        )).toStrictEqual(['ui', 'a.ts']);
      });

      it('searches the path as written when it does not lie under the root', () => {
        expect(extractSegment(
          '@/entities/foo/ui/index.ts',
          undefined,
          undefined,
          { slice: 'foo', index: 0 },
          '/checkout/entities/proj',
        )).toStrictEqual(['ui', 'index.ts']);
      });
    });
  });

  /*
   * The name list route begins with the same layer search and needs the same anchor. A
   * checkout held in a folder named after a layer otherwise turns the folders between that
   * ancestor and the project's own tree into a slice, and the first configured segment name
   * below it into a segment, for a path that carries no layer of its own at all.
   */
  describe('the name list route under a project root', () => {
    it('finds no segment below a root whose ancestor carries a layer name', () => {
      expect(extractSegment(
        '/checkout/entities/proj/src/assets/index.ts',
        undefined,
        undefined,
        undefined,
        '/checkout/entities/proj',
      )).toStrictEqual([null, null]);
    });

    it('still reads the segment of a path that carries its own layer below the root', () => {
      expect(extractSegment(
        '/checkout/entities/proj/src/entities/foo/ui/index.ts',
        undefined,
        undefined,
        undefined,
        '/checkout/entities/proj',
      )).toStrictEqual(['ui', 'index.ts']);
    });

    it('reads a path that does not lie under the root as written', () => {
      expect(extractSegment(
        '@/entities/foo/ui/index.ts',
        undefined,
        undefined,
        undefined,
        '/checkout/entities/proj',
      )).toStrictEqual(['ui', 'index.ts']);
    });
  });
});
