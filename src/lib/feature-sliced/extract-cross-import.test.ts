import { extractCrossImportInfo } from './extract-cross-import';

describe('extract-cross-import', () => {
  describe('valid @x patterns', () => {
    const validCases = [
      {
        name: 'basic @x pattern',
        path: 'entities/User/@x/Session',
        expected: {
          isCrossImport: true,
          sourceSlice: 'User',
          targetSlice: 'Session',
        },
      },
      {
        name: 'with src prefix',
        path: 'src/entities/User/@x/Session',
        expected: {
          isCrossImport: true,
          sourceSlice: 'User',
          targetSlice: 'Session',
        },
      },
      {
        name: 'with @ alias',
        path: '@/entities/User/@x/Session',
        expected: {
          isCrossImport: true,
          sourceSlice: 'User',
          targetSlice: 'Session',
        },
      },
      {
        name: 'with ~ alias',
        path: '~/entities/User/@x/Session',
        expected: {
          isCrossImport: true,
          sourceSlice: 'User',
          targetSlice: 'Session',
        },
      },
      {
        name: 'with .ts extension',
        path: 'entities/User/@x/Session.ts',
        expected: {
          isCrossImport: true,
          sourceSlice: 'User',
          targetSlice: 'Session',
        },
      },
      {
        name: 'with .tsx extension',
        path: '@/entities/User/@x/Session.tsx',
        expected: {
          isCrossImport: true,
          sourceSlice: 'User',
          targetSlice: 'Session',
        },
      },
      {
        name: 'with group folder',
        path: 'entities/users/Admin/@x/Guest',
        expected: {
          isCrossImport: true,
          sourceSlice: 'Admin',
          targetSlice: 'Guest',
        },
      },
      {
        name: 'with nested group folders',
        path: '@/entities/domain/users/Admin/@x/Guest',
        expected: {
          isCrossImport: true,
          sourceSlice: 'Admin',
          targetSlice: 'Guest',
        },
      },
      {
        name: 'with hyphenated slice names',
        path: 'entities/user-profile/@x/user-session',
        expected: {
          isCrossImport: true,
          sourceSlice: 'user-profile',
          targetSlice: 'user-session',
        },
      },
      {
        name: 'with long path prefix',
        path: 'some/long/path/entities/User/@x/Session',
        expected: {
          isCrossImport: true,
          sourceSlice: 'User',
          targetSlice: 'Session',
        },
      },
    ];

    it.each(validCases)('$name: $path', ({ path, expected }) => {
      expect(extractCrossImportInfo(path)).toEqual(expected);
    });
  });

  describe('invalid @x patterns (non-entities layer)', () => {
    const nonEntitiesCases = [
      {
        name: 'features layer',
        path: 'features/Auth/@x/User',
      },
      {
        name: 'widgets layer',
        path: '@/widgets/Header/@x/Footer',
      },
      {
        name: 'pages layer',
        path: 'src/pages/Home/@x/Profile',
      },
    ];

    it.each(nonEntitiesCases)('$name: $path returns isCrossImport: false', ({ path }) => {
      expect(extractCrossImportInfo(path)).toEqual({
        isCrossImport: false,
        sourceSlice: null,
        targetSlice: null,
      });
    });
  });

  describe('invalid @x patterns (nested paths)', () => {
    const nestedCases = [
      {
        name: 'nested path after target slice',
        path: 'entities/User/@x/Session/types',
      },
      {
        name: 'nested file after target slice',
        path: 'entities/User/@x/Session/index.ts',
      },
      {
        name: 'deeply nested',
        path: '@/entities/User/@x/Session/model/hooks',
      },
    ];

    it.each(nestedCases)('$name: $path returns isCrossImport: false', ({ path }) => {
      expect(extractCrossImportInfo(path)).toEqual({
        isCrossImport: false,
        sourceSlice: null,
        targetSlice: null,
      });
    });
  });

  describe('paths without @x', () => {
    const nonCrossImportCases = [
      {
        name: 'regular entity import',
        path: 'entities/User',
      },
      {
        name: 'entity with segment',
        path: '@/entities/User/model',
      },
      {
        name: 'entity with file',
        path: 'src/entities/User/ui/UserCard.tsx',
      },
      {
        name: 'shared layer',
        path: '@/shared/ui/Button',
      },
      {
        name: 'external package',
        path: 'react',
      },
      {
        name: 'relative import',
        path: '../User/model',
      },
    ];

    it.each(nonCrossImportCases)('$name: $path returns isCrossImport: false', ({ path }) => {
      expect(extractCrossImportInfo(path)).toEqual({
        isCrossImport: false,
        sourceSlice: null,
        targetSlice: null,
      });
    });
  });
});
