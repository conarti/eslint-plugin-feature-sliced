import { DEFAULT_SEGMENTS } from '../../config';
import {
  isKnownSegment,
  normalizeSegmentsConfig,
} from './segments-config';

describe('segments-config', () => {
  describe('normalizeSegmentsConfig', () => {
    it('should return default segments when no config provided', () => {
      const result = normalizeSegmentsConfig();

      expect(result).toEqual(DEFAULT_SEGMENTS);
    });

    it('should return default segments when config is undefined', () => {
      const result = normalizeSegmentsConfig(undefined);

      expect(result).toEqual(DEFAULT_SEGMENTS);
    });

    it('should extend defaults when array provided (extend mode)', () => {
      const result = normalizeSegmentsConfig(['services', 'hooks']);

      expect(result).toEqual([...DEFAULT_SEGMENTS, 'services', 'hooks']);
    });

    it('should replace defaults when object with replace provided', () => {
      const result = normalizeSegmentsConfig({ replace: ['ui', 'services'] });

      expect(result).toEqual(['ui', 'services']);
    });

    it('should convert segment names to lowercase in extend mode', () => {
      const result = normalizeSegmentsConfig(['Services', 'HOOKS']);

      expect(result).toContain('services');
      expect(result).toContain('hooks');
    });

    it('should convert segment names to lowercase in replace mode', () => {
      const result = normalizeSegmentsConfig({ replace: ['UI', 'Model'] });

      expect(result).toEqual(['ui', 'model']);
    });

    it('should handle empty array in extend mode', () => {
      const result = normalizeSegmentsConfig([]);

      expect(result).toEqual(DEFAULT_SEGMENTS);
    });

    it('should handle empty array in replace mode', () => {
      const result = normalizeSegmentsConfig({ replace: [] });

      expect(result).toEqual([]);
    });

    it('should remove duplicates in extend mode', () => {
      const result = normalizeSegmentsConfig(['ui', 'services', 'UI']);

      const uiCount = result.filter((s) => s === 'ui').length;
      expect(uiCount).toBe(1);
      expect(result).toContain('services');
    });

    it('should remove duplicates in replace mode', () => {
      const result = normalizeSegmentsConfig({ replace: ['ui', 'UI', 'model'] });

      expect(result).toEqual(['ui', 'model']);
    });
  });

  describe('isKnownSegment', () => {
    const segments = ['ui', 'model', 'services'];

    it('should return true for known segment', () => {
      expect(isKnownSegment('ui', segments)).toBe(true);
      expect(isKnownSegment('services', segments)).toBe(true);
    });

    it('should return true for known segment with different case', () => {
      expect(isKnownSegment('UI', segments)).toBe(true);
      expect(isKnownSegment('Model', segments)).toBe(true);
    });

    it('should return false for unknown segment', () => {
      expect(isKnownSegment('unknown', segments)).toBe(false);
      expect(isKnownSegment('api', segments)).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(isKnownSegment(null, segments)).toBe(false);
      expect(isKnownSegment(undefined, segments)).toBe(false);
      expect(isKnownSegment(123, segments)).toBe(false);
      expect(isKnownSegment({ name: 'ui' }, segments)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isKnownSegment('', segments)).toBe(false);
    });
  });

  describe('default segments constant', () => {
    it('should contain all FSD default segments', () => {
      expect(DEFAULT_SEGMENTS).toContain('ui');
      expect(DEFAULT_SEGMENTS).toContain('model');
      expect(DEFAULT_SEGMENTS).toContain('lib');
      expect(DEFAULT_SEGMENTS).toContain('api');
      expect(DEFAULT_SEGMENTS).toContain('config');
      expect(DEFAULT_SEGMENTS).toContain('assets');
    });

    it('should have exactly 6 default segments', () => {
      expect(DEFAULT_SEGMENTS).toHaveLength(6);
    });
  });
});
