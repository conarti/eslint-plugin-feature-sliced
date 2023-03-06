const assert = require('assert');
const { normalizePath } = require('./normalize-path');

describe('normalizePath', () => {
  it('should works at windows', () => {
    const path = 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx';
    const expected = 'C:/Users/tim/Desktop/javascript/production_project/src/entities/StoreDecorator.tsx';
    const actual = normalizePath(path);

    assert.strictEqual(actual, expected);
  });

  it('should works at unix', () => {
    const path = '/Users/conarti/Projects/react-course/src/widgets/TheHeader/ui/TheHeader.stories.tsx';
    const expected = '/Users/conarti/Projects/react-course/src/widgets/TheHeader/ui/TheHeader.stories.tsx';
    const actual = normalizePath(path);

    assert.strictEqual(actual, expected);
  });

  it('should return "./"', () => {
    const path = './foo.ts';
    const expected = './foo.ts';
    const actual = normalizePath(path);

    assert.strictEqual(actual, expected);
  });

  it('should normalize ".."', () => {
    const path = './foo/bar/..';
    const expected = './foo';
    const actual = normalizePath(path);

    assert.strictEqual(actual, expected);
  });
});
