import { convertToAbsolute } from './convert-to-absolute';

describe('convert-to-absolute', () => {
  it.each([
    {
      base: '/src/entities/foo-bar-baz/ui/index.vue',
      target: '',
      expected: '/src/entities/foo-bar-baz/ui/index.vue',
    },
    {
      base: '',
      target: '../../foo/bar/baz.ts',
      expected: '../../foo/bar/baz.ts',
    },
    {
      base: 'feature-sliced-frontend/src/entities/foo-bar-baz/ui/index.vue',
      target: 'feature-sliced-frontend/src/entities/foo-bar-baz/ui/index.vue',
      expected: 'feature-sliced-frontend/src/entities/foo-bar-baz/ui/index.vue',
    },
    {
      base: 'feature-sliced-frontend/src/entities/foo-bar-baz/ui/index.vue',
      target: '../../foo-bar/ui/index.vue',
      expected: 'feature-sliced-frontend/src/entities/foo-bar/ui/index.vue',
    },
    {
      base: 'src/entities/foo/model.ts',
      target: '../../features',
      expected: 'src/features',
    },
    {
      base: 'src/entities/foo/index.ts',
      target: '../../features/model.ts',
      expected: 'src/features/model.ts',
    },
    {
      base: 'src/entities/foo/bar',
      target: '../../features/model.ts',
      expected: 'src/features/model.ts',
    },
    {
      base: 'src/entities/foo/bar.ts',
      target: './baz.ts',
      expected: 'src/entities/foo/baz.ts',
    },
    {
      base: 'src/pages/foo-bar/lib/index.ts',
      target: './generatePayloadMapper',
      expected: 'src/pages/foo-bar/lib/generatePayloadMapper',
    },
  ])('should works %#', ({
    base,
    target,
    expected,
  }) => {
    const actual = convertToAbsolute(base, target);

    expect(actual).toStrictEqual(expected);
  });
});
