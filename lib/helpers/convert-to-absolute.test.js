const assert = require('assert');
const { convertToAbsolute } = require('./convert-to-absolute');

describe('convert-to-absolute', () => {
  it('should works with empty targetPath', () => {
    const actual = convertToAbsolute(
      '/Users/conarti/Projects/feature-sliced-frontend/src/entities/foo-bar-baz/ui/index.vue',
      ''
      );
    const expected = '/Users/conarti/Projects/feature-sliced-frontend/src/entities/foo-bar-baz/ui/index.vue';

    assert.strictEqual(actual, expected);
  });

  it('should works with empty', () => {
    const actual = convertToAbsolute(
      '',
      '../../foo/bar/baz.ts'
    );
    const expected = '../../foo/bar/baz.ts';

    assert.strictEqual(actual, expected);
  });

  it('should works 1', () => {
    const actual = convertToAbsolute(
      'feature-sliced-frontend/src/entities/foo-bar-baz/ui/index.vue',
      '../../foo-bar/ui/index.vue'
    );
    const expected = 'feature-sliced-frontend/src/entities/foo-bar/ui/index.vue';

    assert.strictEqual(actual, expected);
  });

  it('should works 2', () => {
    const actual = convertToAbsolute(
      'src/entities/foo/model.ts',
      '../../features'
    );
    const expected = 'src/features';

    assert.strictEqual(actual, expected);
  });

  it('should works 3', () => {
    const actual = convertToAbsolute(
      'src/entities/foo/index.ts',
      '../../features/model.ts'
    );
    const expected = 'src/features/model.ts';

    assert.strictEqual(actual, expected);
  });

  it('should works 4', () => {
    const actual = convertToAbsolute(
      'src/entities/foo/bar',
      '../../features/model.ts'
    );
    const expected = 'src/features/model.ts';

    assert.strictEqual(actual, expected);
  });
});
