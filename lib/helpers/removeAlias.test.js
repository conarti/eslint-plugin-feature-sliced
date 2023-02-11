const assert = require('assert');
const { removeAlias } = require('./removeAlias');

describe('removeAlias', () => {
  it('should remove alias', () => {
    const path = '@/widgets/TheHeader';
    const expected = 'widgets/TheHeader';
    const actual = removeAlias(path);

    assert.strictEqual(actual, expected);
  });
});
