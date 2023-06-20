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
    // {
    //   name: 'should correct return layer if path contain multiple layer names',
    //   path: 'src/processes/shared/index.ts',
    //   expected: 'processes',
    // },
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
    expected,
  }) => {
    const actual = extractLayer(path);
    expect(actual).toBe(expected);
  });
});
