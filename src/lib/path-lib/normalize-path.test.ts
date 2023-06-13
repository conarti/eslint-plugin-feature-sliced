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
  ])('$name', ({
    path,
    expected,
  }) => {
    const actual = normalizePath(path);

    expect(actual).toBe(expected);
  });
});
