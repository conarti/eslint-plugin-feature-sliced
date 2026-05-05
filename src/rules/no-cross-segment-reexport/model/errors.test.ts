import { buildSlicePublicApiPath } from './errors';

describe('buildSlicePublicApiPath', () => {
  it('should replace sibling segment with parent reference', () => {
    expect(buildSlicePublicApiPath('../api', 'api')).toBe('..');
  });

  it('should handle deeper nesting (../../api)', () => {
    expect(buildSlicePublicApiPath('../../api', 'api')).toBe('../..');
  });

  it('should handle non-standard segment names', () => {
    expect(buildSlicePublicApiPath('../i18n', 'i18n')).toBe('..');
  });

  it('should handle segment with subpath', () => {
    expect(buildSlicePublicApiPath('../api/endpoints', 'api')).toBe('..');
  });

  it('should use fallback when segment not found in path', () => {
    expect(buildSlicePublicApiPath('../unknown', 'api')).toBe('..');
  });
});
