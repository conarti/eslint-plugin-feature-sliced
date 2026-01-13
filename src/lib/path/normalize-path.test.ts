import { normalizePath } from './normalize-path';

describe('normalize-path', () => {
  it.each([
    {
      name: 'should convert windows to unix',
      path: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx',
      expected: 'C:/Users/tim/Desktop/javascript/production_project/src/entities/StoreDecorator.tsx',
    },
    {
      name: 'should not convert unix',
      path: '/Users/conarti/Projects/react-course/src/widgets/TheHeader/ui/TheHeader.stories.tsx',
      expected: '/Users/conarti/Projects/react-course/src/widgets/TheHeader/ui/TheHeader.stories.tsx',
    },
    {
      name: 'should not remove "./" from start',
      path: './foo.ts',
      expected: './foo.ts',
    },
    {
      name: 'should normalize ".."',
      path: './foo/bar/..',
      expected: './foo',
    },
    {
      name: 'should handle mixed separators',
      path: 'C:/foo\\bar/baz\\file.ts',
      expected: 'C:/foo/bar/baz/file.ts',
    },
    {
      name: 'should handle relative path with backslashes',
      path: '..\\foo\\bar',
      expected: '../foo/bar',
    },
    {
      name: 'should preserve "./" with backslashes inside',
      path: './foo\\bar\\baz',
      expected: './foo/bar/baz',
    },
    {
      name: 'should handle drive letter lowercase',
      path: 'c:\\Users\\Project',
      expected: 'c:/Users/Project',
    },
    {
      name: 'should handle UNC paths',
      path: '\\\\server\\share\\path',
      expected: '//server/share/path',
    },
    {
      name: 'should preserve trailing slash',
      path: 'C:\\foo\\bar\\',
      expected: 'C:/foo/bar/',
    },
    {
      name: 'should handle path with only backslashes',
      path: '\\foo\\bar\\baz',
      expected: '/foo/bar/baz',
    },
  ])('$name', ({
    path,
    expected,
  }) => {
    const actual = normalizePath(path);

    expect(actual).toBe(expected);
  });
});
