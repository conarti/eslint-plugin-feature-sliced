import { extractLayer } from './extract-layer';

describe('extract-layer', () => {
  const cases = [
    {
      path: 'src/entities/foo',
      expected: 'entities',
    },
    {
      path: 'some/long/root/path/entities/foo',
      expected: 'entities',
    },
    {
      name: 'should correct return layer if path contain multiple layer names (from content root without cwd)',
      path: 'src/processes/shared/index.ts',
      expected: 'processes',
    },
    {
      name: 'should correct return layer if path contain multiple layer names (with cwd option)',
      path: '/User/test/Projects/app/src/shared/index.ts',
      cwd: '/User/test/Projects/app',
      expected: 'shared',
    },
    {
      path: 'entities/foo',
      expected: 'entities',
    },
    {
      path: 'EntitiEs/foo',
      expected: 'entities',
    },
    {
      path: './index.ts',
      expected: null,
    },
    {
      path: './app.ts',
      expected: null,
    },
    {
      path: './entitiesInName.ts',
      expected: null,
    },
  ];

  it.each(cases)('$path', ({
    path,
    cwd,
    expected,
  }) => {
    const actual = extractLayer(path, cwd);
    expect(actual).toBe(expected);
  });
});
