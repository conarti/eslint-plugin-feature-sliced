import { hasPath } from './has-path';

describe('hasPath', () => {
  it('should return false for a non-object node (null)', () => {
    expect(hasPath(null)).toBe(false);
  });

  it('should return false for a non-object node (string)', () => {
    expect(hasPath('foo')).toBe(false);
  });

  it('should return false for an object lacking a source property', () => {
    const node = { type: 'ExportSpecifier' };

    expect(hasPath(node)).toBe(false);
  });

  it('should return false when source is null', () => {
    const node = { type: 'ExportNamedDeclaration', source: null };

    expect(hasPath(node)).toBe(false);
  });

  it('should return false when the source carries no string value', () => {
    const node = { type: 'ImportDeclaration', source: {} };

    expect(hasPath(node)).toBe(false);
  });

  it('should return false when the source is a template literal', () => {
    const node = { type: 'ImportExpression', source: { type: 'TemplateLiteral', quasis: [] } };

    expect(hasPath(node)).toBe(false);
  });

  it('should return false when the source value is not a string', () => {
    const node = { type: 'ImportExpression', source: { type: 'Literal', value: 123 } };

    expect(hasPath(node)).toBe(false);
  });

  it('should return false when the source is an identifier', () => {
    const node = { type: 'ImportExpression', source: { type: 'Identifier', name: 'path' } };

    expect(hasPath(node)).toBe(false);
  });

  it('should return true for the happy path with source.value', () => {
    const node = { type: 'ImportDeclaration', source: { type: 'Literal', value: './foo' } };

    expect(hasPath(node)).toBe(true);
  });
});
