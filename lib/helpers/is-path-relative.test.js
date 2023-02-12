const assert = require('assert');
const { isPathRelative } = require('./is-path-relative');

describe('isPathRelative', () => {
  it('should detect "." path as relative', () => {
    const path = '.';
    const expected = true;
    const actual = isPathRelative(path);

    assert.strictEqual(actual, expected);
  });

  it('should detect "./" path as relative', () => {
    const path = './foo/bar';
    const expected = true;
    const actual = isPathRelative(path);

    assert.strictEqual(actual, expected);
  });

  it('should detect "../" path as relative', () => {
    const path = '../foo/bar/baz';
    const expected = true;
    const actual = isPathRelative(path);

    assert.strictEqual(actual, expected);
  });

  it('should not detect absolute path as relative', () => {
    const path = 'foo/bar/baz';
    const expected = false;
    const actual = isPathRelative(path);

    assert.strictEqual(actual, expected);
  });

  it('should not detect root path as relative', () => {
    const path = '/foo/bar/baz';
    const expected = false;
    const actual = isPathRelative(path);

    assert.strictEqual(actual, expected);
  });
});
