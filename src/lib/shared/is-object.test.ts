import { isObject } from './is-object';

describe('isObject', () => {
  it('should return false for null', () => {
    expect(isObject(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isObject(undefined)).toBe(false);
  });

  it('should return false for a string', () => {
    expect(isObject('foo')).toBe(false);
  });

  it('should return false for a number', () => {
    expect(isObject(42)).toBe(false);
  });

  it('should return false for a boolean', () => {
    expect(isObject(true)).toBe(false);
  });

  it('should return true for a plain object', () => {
    expect(isObject({})).toBe(true);
  });

  it('should return true for an array', () => {
    expect(isObject([])).toBe(true);
  });

  it('should return true for a function', () => {
    expect(isObject(() => {})).toBe(true);
  });
});
