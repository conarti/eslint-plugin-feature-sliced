import { convertToAbsolute } from './convert-to-absolute';

describe('convert-to-absolute', () => {
  it.each([
    {
      name: 'returns the base path unchanged when the target is empty',
      base: '/src/entities/foo-bar-baz/ui/index.vue',
      target: '',
      expected: '/src/entities/foo-bar-baz/ui/index.vue',
    },
    {
      name: 'returns the target path unchanged when the base is empty',
      base: '',
      target: '../../foo/bar/baz.ts',
      expected: '../../foo/bar/baz.ts',
    },
    {
      name: 'returns the target path unchanged when it is not a relative path',
      base: 'feature-sliced-frontend/src/entities/foo-bar-baz/ui/index.vue',
      target: 'feature-sliced-frontend/src/entities/foo-bar-baz/ui/index.vue',
      expected: 'feature-sliced-frontend/src/entities/foo-bar-baz/ui/index.vue',
    },
    {
      name: 'resolves a two-level parent-relative import against the base file directory',
      base: 'feature-sliced-frontend/src/entities/foo-bar-baz/ui/index.vue',
      target: '../../foo-bar/ui/index.vue',
      expected: 'feature-sliced-frontend/src/entities/foo-bar/ui/index.vue',
    },
    {
      name: 'resolves a parent-relative import up to a sibling top-level layer directory',
      base: 'src/entities/foo/model.ts',
      target: '../../features',
      expected: 'src/features',
    },
    {
      name: 'resolves a parent-relative import to a file in a sibling layer directory',
      base: 'src/entities/foo/index.ts',
      target: '../../features/model.ts',
      expected: 'src/features/model.ts',
    },
    {
      name: 'resolves a parent-relative import the same way when the base path has no file extension',
      base: 'src/entities/foo/bar',
      target: '../../features/model.ts',
      expected: 'src/features/model.ts',
    },
    {
      name: 'resolves a same-directory relative import next to the base file',
      base: 'src/entities/foo/bar.ts',
      target: './baz.ts',
      expected: 'src/entities/foo/baz.ts',
    },
    {
      name: 'resolves a same-directory relative import to a file without an extension',
      base: 'src/pages/foo-bar/lib/index.ts',
      target: './generatePayloadMapper',
      expected: 'src/pages/foo-bar/lib/generatePayloadMapper',
    },
  ])('$name', ({
    base,
    target,
    expected,
  }) => {
    const actual = convertToAbsolute(base, target);

    expect(actual).toStrictEqual(expected);
  });
});
