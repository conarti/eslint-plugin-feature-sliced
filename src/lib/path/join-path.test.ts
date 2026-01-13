import { joinPath } from './join-path';

describe('join-path', () => {
  it.each([
    {
      name: 'should join Unix paths',
      from: '/Users/project/src',
      to: 'entities/foo',
      expected: '/Users/project/src/entities/foo',
    },
    {
      name: 'should join Windows paths and normalize',
      from: 'C:\\Users\\project\\src',
      to: 'entities\\foo',
      expected: 'C:/Users/project/src/entities/foo',
    },
    {
      name: 'should handle relative to segment',
      from: '/src/features/foo/ui',
      to: '../model',
      expected: '/src/features/foo/model',
    },
    {
      name: 'should handle mixed separators',
      from: 'C:/Users/project',
      to: '..\\shared\\lib',
      expected: 'C:/Users/shared/lib',
    },
    {
      name: 'should handle empty to',
      from: '/src/features',
      to: '',
      expected: '/src/features',
    },
    {
      name: 'should handle multiple parent segments',
      from: '/src/features/foo/ui/components',
      to: '../../model/types',
      expected: '/src/features/foo/model/types',
    },
    {
      name: 'should handle empty from',
      from: '',
      to: 'entities/foo',
      expected: 'entities/foo',
    },
  ])('$name', ({ from, to, expected }) => {
    expect(joinPath(from, to)).toBe(expected);
  });
});
