import { DEFAULT_SEGMENTS, layersWithoutSlices } from '../../config';
import { extractSlice } from './extract-slice';

const FSD_LAYERS_WITHOUT_SLICES = layersWithoutSlices;
const CUSTOM_SEGMENTS = [...DEFAULT_SEGMENTS, 'services', 'hooks'];

describe('extract-slice', () => {
  describe('layers without slices', () => {
    const cases = FSD_LAYERS_WITHOUT_SLICES.map((layer) => ({
      name: `should not return slice from layer "${layer}"`,
      path: `src/${layer}/foo/index.ts`,
      expected: null,
    }));

    it.each(cases)('$name', ({ path, expected }) => {
      expect(extractSlice(path)).toBe(expected);
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
      expect(extractSlice(path)).toBe(expected);
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
      expect(extractSlice(path)).toBe(expected);
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
      expect(extractSlice(path)).toBe(expected);
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
      expect(extractSlice(path)).toBe(expected);
    });
  });

  describe('with custom segments config', () => {
    it('should use custom segment as boundary for slice detection', () => {
      const result = extractSlice(
        'src/entities/foo/services/index.ts',
        undefined,
        CUSTOM_SEGMENTS,
      );
      expect(result).toBe('foo');
    });

    it('should work with another custom segment', () => {
      const result = extractSlice(
        'src/features/auth/LoginForm/hooks/useAuth.ts',
        undefined,
        CUSTOM_SEGMENTS,
      );
      expect(result).toBe('LoginForm');
    });

    it('should still recognize default segments with custom config', () => {
      const result = extractSlice(
        'src/entities/User/model/index.ts',
        undefined,
        CUSTOM_SEGMENTS,
      );
      expect(result).toBe('User');
    });

    it('should use fallback when unknown segment used (not in custom config)', () => {
      const replaceSegments = ['services', 'stores'];
      const result = extractSlice(
        'src/entities/foo/ui/index.ts',
        undefined,
        replaceSegments,
      );
      /* When ui is not recognized as segment, fallback returns last folder */
      expect(result).toBe('ui');
    });

    it('should work with replace mode segments', () => {
      const replaceSegments = ['services', 'stores'];
      const result = extractSlice(
        'src/entities/foo/services/index.ts',
        undefined,
        replaceSegments,
      );
      expect(result).toBe('foo');
    });

    it('should work with group folders and custom segments', () => {
      const result = extractSlice(
        'src/entities/group/User/services/api.ts',
        undefined,
        CUSTOM_SEGMENTS,
      );
      expect(result).toBe('User');
    });
  });
});
