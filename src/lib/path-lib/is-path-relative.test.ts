import { isPathRelative } from './is-path-relative';

describe('is-path-relative', () => {
  it.each([
    {
      name: 'should detect "." as relative',
      path: '.',
      expected: true,
    },
    {
      name: 'should detect "./" as relative',
      path: './foo/bar',
      expected: true,
    },
    {
      name: 'should detect "../" as relative',
      path: '../foo/bar/baz',
      expected: true,
    },
    {
      name: 'should not detect absolute path as relative',
      path: 'foo/bar/baz',
      expected: false,
    },
    {
      name: 'should not detect root path as relative',
      path: '/foo/bar/baz',
      expected: false,
    },
  ])('$name', ({
    path,
    expected,
  }) => {
    const actual = isPathRelative(path);

    expect(actual).toBe(expected);
  });
});
