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

  it('should remove "@/" alias', () => {
    const path = '@/widgets/TheHeader';
    const expected = 'widgets/TheHeader';

    assert.strictEqual(normalizePath(path), expected);
  });

  it('should remove "~/" alias', () => {
    const path = '~/widgets/TheHeader';
    const expected = 'widgets/TheHeader';

    assert.strictEqual(normalizePath(path), expected);
  });

  it('should remove "@" alias', () => {
    const path = '@widgets/TheHeader';
    const expected = 'widgets/TheHeader';

    assert.strictEqual(normalizePath(path), expected);
  });

  it('should remove "@src/" alias', () => {
    const path = '@src/widgets/TheHeader';
    const expected = 'widgets/TheHeader';

    assert.strictEqual(normalizePath(path), expected);
  });

  it('should remove "~src/" alias', () => {
    const path = '~src/widgets/TheHeader';
    const expected = 'widgets/TheHeader';

    assert.strictEqual(normalizePath(path), expected);
  });

  it('should remove "~@" alias', () => {
    const path = '~@widgets/TheHeader';
    const expected = 'widgets/TheHeader';

    assert.strictEqual(normalizePath(path), expected);
  });

  it('should remove "~@/" alias', () => {
    const path = '~@/widgets/TheHeader';
    const expected = 'widgets/TheHeader';

    assert.strictEqual(normalizePath(path), expected);
  });

  it('should remove "%№$" alias', () => {
    const path = '%№$widgets/TheHeader';
    const expected = 'widgets/TheHeader';

    assert.strictEqual(normalizePath(path), expected);
  });

  it('should remove "%№$*&/" alias', () => {
    const path = '%№$*&/widgets/TheHeader';
    const expected = 'widgets/TheHeader';

    assert.strictEqual(normalizePath(path), expected);
  });

  it('should remove only aliases', () => {
    const path = 'asdsad/widgets/TheHeader';
    const expected = 'asdsad/widgets/TheHeader';

    assert.strictEqual(normalizePath(path), expected);
  });
});
