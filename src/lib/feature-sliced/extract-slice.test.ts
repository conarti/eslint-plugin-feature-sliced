import { DEFAULT_SEGMENTS, layersWithoutSlices } from '../../config';
import { extractSlice } from './extract-slice';

const CUSTOM_SEGMENTS = [...DEFAULT_SEGMENTS, 'services', 'hooks'];

describe('extract-slice', () => {
  describe('layers without slices', () => {
    const cases = layersWithoutSlices.map((layer) => ({
      name: `should not return slice from layer "${layer}"`,
      path: `src/${layer}/foo/index.ts`,
      expected: null,
    }));

    it.each(cases)('$name', ({ path, expected }) => {
      expect(extractSlice(path).slice).toBe(expected);
    });
  });

  describe('standard cases (slice with FSD-segment)', () => {
    const cases = [
      {
        name: 'slice with segment',
        path: 'src/entities/foo/model',
        expected: 'foo',
      },
      {
        name: 'slice without src prefix',
        path: 'entities/foo/ui',
        expected: 'foo',
      },
      {
        name: 'slice with segment and file',
        path: '/Users/dev/projects/src/entities/foo-bar-baz/ui/index.vue',
        expected: 'foo-bar-baz',
      },
      {
        name: 'slice with layer name in slice name',
        path: 'src/features/foo-pages/ui/foo.vue',
        expected: 'foo-pages',
      },
      {
        name: 'slice with segment as file',
        path: 'src/entities/User/model.ts',
        expected: 'User',
      },
    ];

    it.each(cases)('$name: $path', ({ path, expected }) => {
      expect(extractSlice(path).slice).toBe(expected);
    });
  });

  describe('group folders (slice before FSD-segment)', () => {
    const cases = [
      {
        name: 'one level group folder',
        path: 'src/entities/group/User/model',
        expected: 'User',
      },
      {
        name: 'two levels group folders',
        path: 'src/entities/group/subgroup/User/model',
        expected: 'User',
      },
      {
        name: 'group folder with segment file',
        path: 'src/entities/group/User/model/index.ts',
        expected: 'User',
      },
      {
        name: 'group folder with segment as file',
        path: 'src/entities/group/User/model.ts',
        expected: 'User',
      },
      {
        name: 'features layer with group folder',
        path: 'src/features/auth/LoginForm/ui',
        expected: 'LoginForm',
      },
      {
        name: 'widgets layer with group folder',
        path: 'src/widgets/navigation/Header/ui',
        expected: 'Header',
      },
      {
        name: 'pages layer with group folder',
        path: 'src/pages/settings/ProfilePage/ui',
        expected: 'ProfilePage',
      },
      {
        name: 'long path with group folder',
        path: '/Users/dev/projects/app/src/entities/domain/users/Admin/model/file.ts',
        expected: 'Admin',
      },
    ];

    it.each(cases)('$name: $path', ({ path, expected }) => {
      expect(extractSlice(path).slice).toBe(expected);
    });
  });

  describe('fallback (no FSD-segment)', () => {
    const cases = [
      {
        name: 'slice only',
        path: 'src/entities/foo',
        expected: 'foo',
      },
      {
        name: 'slice only without src',
        path: 'entities/foo',
        expected: 'foo',
      },
      {
        name: 'group folder without segment',
        path: 'src/entities/group/User',
        expected: 'User',
      },
      {
        name: 'nested group folders without segment',
        path: 'src/entities/group/subgroup/User',
        expected: 'User',
      },
      {
        name: 'path with unknown folders (takes last)',
        path: 'entities/foo/bar/baz',
        expected: 'baz',
      },
      {
        name: 'long path with unknown folders',
        path: 'some/long/path/entities/foo/bar/baz',
        expected: 'baz',
      },
      {
        name: 'path with file (takes last folder)',
        path: 'some/long/path/entities/foo/bar/baz.tsx',
        expected: 'bar',
      },
    ];

    it.each(cases)('$name: $path', ({ path, expected }) => {
      expect(extractSlice(path).slice).toBe(expected);
    });
  });

  describe('edge cases', () => {
    const cases = [
      {
        name: 'segment-named group folder (first after layer = slice)',
        path: 'src/entities/model/User/ui',
        expected: 'model',
      },
      {
        name: 'layer only',
        path: 'entities',
        expected: null,
      },
      {
        name: 'src/layer only',
        path: 'src/entities',
        expected: null,
      },
      {
        name: 'empty path',
        path: '',
        expected: null,
      },
      {
        name: 'no layer in path',
        path: 'src/components/Button',
        expected: null,
      },
      {
        name: 'segment directly after layer without slice',
        path: 'src/entities/api/queries.ts',
        expected: null,
      },
      {
        name: 'another segment directly after layer without slice',
        path: 'src/entities/model/mappers.ts',
        expected: null,
      },
      {
        name: 'segment after layer with extensionless file (no slice)',
        path: 'src/entities/model/mappers',
        expected: null,
      },
      {
        name: 'slice with numbers',
        path: 'src/entities/User123/model',
        expected: 'User123',
      },
      {
        name: 'slice with underscore',
        path: 'src/entities/user_profile/model',
        expected: 'user_profile',
      },
    ];

    it.each(cases)('$name: $path', ({ path, expected }) => {
      expect(extractSlice(path).slice).toBe(expected);
    });
  });

  describe('with custom segments config', () => {
    it('should use custom segment as boundary for slice detection', () => {
      const result = extractSlice(
        'src/entities/foo/services/index.ts',
        undefined,
        CUSTOM_SEGMENTS,
      );
      expect(result.slice).toBe('foo');
    });

    it('should work with another custom segment', () => {
      const result = extractSlice(
        'src/features/auth/LoginForm/hooks/useAuth.ts',
        undefined,
        CUSTOM_SEGMENTS,
      );
      expect(result.slice).toBe('LoginForm');
    });

    it('should still recognize default segments with custom config', () => {
      const result = extractSlice(
        'src/entities/User/model/index.ts',
        undefined,
        CUSTOM_SEGMENTS,
      );
      expect(result.slice).toBe('User');
    });

    it('should use fallback when unknown segment used (not in custom config)', () => {
      const replaceSegments = ['services', 'stores'];
      const result = extractSlice(
        'src/entities/foo/ui/index.ts',
        undefined,
        replaceSegments,
      );
      /* When ui is not recognized as segment, fallback returns last folder */
      expect(result.slice).toBe('ui');
    });

    it('should work with replace mode segments', () => {
      const replaceSegments = ['services', 'stores'];
      const result = extractSlice(
        'src/entities/foo/services/index.ts',
        undefined,
        replaceSegments,
      );
      expect(result.slice).toBe('foo');
    });

    it('should work with group folders and custom segments', () => {
      const result = extractSlice(
        'src/entities/group/User/services/api.ts',
        undefined,
        CUSTOM_SEGMENTS,
      );
      expect(result.slice).toBe('User');
    });
  });

  describe('path normalization (leading, doubled and trailing slashes)', () => {
    const cases = [
      {
        name: 'leading slash returns the same slice as the clean path',
        path: '/entities/orders/model',
        expected: 'orders',
      },
      {
        name: 'doubled slash returns the same slice as the clean path',
        path: 'entities//orders/model',
        expected: 'orders',
      },
      {
        name: 'trailing slash returns the same slice as the clean path',
        path: 'entities/orders/',
        expected: 'orders',
      },
      {
        name: 'doubled trailing slash returns the same slice as the clean path',
        path: 'entities/orders//',
        expected: 'orders',
      },
    ];

    it.each(cases)('$name: $path', ({ path, expected }) => {
      expect(extractSlice(path).slice).toBe(expected);
    });
  });

  describe('layer boundary detection', () => {
    const cases = [
      {
        name: 'no layer at all',
        path: 'src/utils/helpers/index.ts',
        expected: null,
      },
      {
        name: 'layer as the last path part',
        path: 'src/entities',
        expected: null,
      },
      {
        name: 'layer with exactly one part after it',
        path: 'src/entities/orders',
        expected: 'orders',
      },
    ];

    it.each(cases)('$name: $path', ({ path, expected }) => {
      expect(extractSlice(path).slice).toBe(expected);
    });
  });

  describe('segment directly after layer (segmentIndex === 0)', () => {
    const cases = [
      {
        name: 'bare segment with no further segment returns null',
        path: 'entities/api/queries',
        expected: null,
      },
      {
        name: 'bare segment with no further segment returns null (uppercase segment)',
        path: 'entities/API/queries',
        expected: null,
      },
      {
        name: 'segment-named group folder returns the segment name',
        path: 'entities/model/OrderDetails/ui',
        expected: 'model',
      },
      {
        name: 'segment-named group folder returns the segment name, original case preserved',
        path: 'entities/MODEL/OrderDetails/ui',
        expected: 'MODEL',
      },
      {
        name: 'segment-named group folder with no further segment returns null',
        path: 'entities/model/OrderDetails/notes',
        expected: null,
      },
    ];

    it.each(cases)('$name: $path', ({ path, expected }) => {
      expect(extractSlice(path).slice).toBe(expected);
    });
  });
  /*
   * The filesystem half. The probe is injected as a map, so these cases stay pure and say
   * what the disk holds instead of relying on the shape of the path. Each case asserts the
   * route as well as the value: a resolver that never fires would otherwise pass every row
   * whose two answers coincide, because the fallback is today's heuristic.
   */
  describe('resolution from the filesystem', () => {
    const ROOT = '/proj';

    function probeFor(directories: string[]) {
      const present = new Set(directories.map((directory) => `${ROOT}/${directory}`));
      return (directory: string) => present.has(directory);
    }

    function resolveWith(path: string, directories: string[], segments = [...DEFAULT_SEGMENTS], cwd = ROOT) {
      return extractSlice(path, undefined, segments, { cwd, hasPublicApi: probeFor(directories) });
    }

    it('takes the slice folder over the sub-folder the path heuristic picks', () => {
      expect(resolveWith('/proj/src/widgets/header/hooks/use-x.ts', ['src/widgets/header']))
        .toEqual({ resolved: true, slice: 'header', fallbackSlice: 'hooks' });
    });

    it('keeps two slices under one group folder apart, and answers rather than falls back', () => {
      expect(resolveWith('/proj/src/entities/group/UserA/ui/a.ts', ['src/entities/group/UserA', 'src/entities/group/UserB']))
        .toEqual({ resolved: true, slice: 'UserA', fallbackSlice: 'UserA' });
    });

    it('takes the deepest candidate, so a group folder with its own public api does not swallow its sub-slices', () => {
      expect(resolveWith('/proj/src/features/book/search/ui/x.ts', ['src/features/book', 'src/features/book/search']))
        .toEqual({ resolved: true, slice: 'search', fallbackSlice: 'search' });
    });

    it('does not walk into a segment that carries a public api of its own', () => {
      expect(resolveWith('/proj/src/entities/modal/model/x.ts', ['src/entities/modal/model']))
        .toEqual({ resolved: false, slice: 'modal', fallbackSlice: 'modal' });
    });

    it('does not walk into a configured custom segment either', () => {
      expect(resolveWith('/proj/src/entities/cart/services/a.ts', ['src/entities/cart/services'], CUSTOM_SEGMENTS))
        .toEqual({ resolved: false, slice: 'cart', fallbackSlice: 'cart' });
    });

    it('treats a folder that is not a configured segment as a candidate', () => {
      expect(resolveWith('/proj/src/entities/cart/services/a.ts', ['src/entities/cart/services']))
        .toEqual({ resolved: true, slice: 'services', fallbackSlice: 'services' });
    });

    it('strips the project root preserving its casing, so the probed directory exists', () => {
      expect(extractSlice(
        '/Proj/src/widgets/Header/hooks/use-x.ts',
        undefined,
        [...DEFAULT_SEGMENTS],
        { cwd: '/proj', hasPublicApi: (directory) => directory === '/proj/src/widgets/Header' },
      )).toEqual({ resolved: true, slice: 'Header', fallbackSlice: 'hooks' });
    });

    it('resolves nothing when no candidate holds a public api', () => {
      expect(resolveWith('/proj/src/widgets/header/hooks/use-x.ts', []))
        .toEqual({ resolved: false, slice: 'hooks', fallbackSlice: 'hooks' });
    });

    it('does not probe a path that does not lie under the project root, whatever the probe answers', () => {
      expect(extractSlice(
        '@/widgets/header/hooks',
        undefined,
        [...DEFAULT_SEGMENTS],
        { cwd: ROOT, hasPublicApi: () => true },
      )).toEqual({ resolved: false, slice: 'hooks', fallbackSlice: 'hooks' });
    });

    it('resolves nothing when the path does not lie under the project root', () => {
      expect(resolveWith('@/widgets/header/hooks', ['src/widgets/header']))
        .toEqual({ resolved: false, slice: 'hooks', fallbackSlice: 'hooks' });
    });

    it('resolves nothing without a project root', () => {
      expect(extractSlice(
        '/proj/src/widgets/header/hooks/use-x.ts',
        undefined,
        [...DEFAULT_SEGMENTS],
        { hasPublicApi: () => true },
      )).toEqual({ resolved: false, slice: 'hooks', fallbackSlice: 'hooks' });
    });

    it('resolves nothing without a probe', () => {
      expect(extractSlice(
        '/proj/src/widgets/header/hooks/use-x.ts',
        undefined,
        [...DEFAULT_SEGMENTS],
        { cwd: ROOT },
      )).toEqual({ resolved: false, slice: 'hooks', fallbackSlice: 'hooks' });
    });

    it('resolves nothing when the first part after the layer is already a segment', () => {
      expect(resolveWith('/proj/src/entities/model/User/ui/x.ts', ['src/entities/model', 'src/entities/model/User']))
        .toEqual({ resolved: false, slice: 'model', fallbackSlice: 'model' });
    });

    it('carries no slice at all when the path holds no layer', () => {
      expect(resolveWith('/proj/src/components/Button/index.ts', ['src/components/Button']))
        .toEqual({ resolved: false, slice: null, fallbackSlice: null });
    });
  });
});
