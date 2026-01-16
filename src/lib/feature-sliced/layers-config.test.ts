import type { LayersConfig, NormalizedLayerConfig } from '../../config';
import { DEFAULT_LAYERS_CONFIG } from '../../config';
import {
  canLayerAllowSliceCrossImports,
  canLayerContainSlices,
  getLayerNames,
  getLayersWithoutSlices,
  getLayersWithSlices,
  getLayerWeight,
  isKnownLayer,
  normalizeLayersConfig,
} from './layers-config';

describe('layers-config', () => {
  describe('normalizeLayersConfig', () => {
    it('should return default config when no config provided', () => {
      const result = normalizeLayersConfig();
      expect(result).toHaveLength(7);
      expect(result[0]).toEqual({ name: 'shared', hasSlices: false, allowSliceCrossImports: false });
      expect(result[6]).toEqual({ name: 'app', hasSlices: false, allowSliceCrossImports: false });
    });

    it('should normalize string items to objects with hasSlices: true', () => {
      const config: LayersConfig = ['entities', 'features'];
      const result = normalizeLayersConfig(config);

      expect(result).toEqual([
        { name: 'entities', hasSlices: true, allowSliceCrossImports: false },
        { name: 'features', hasSlices: true, allowSliceCrossImports: false },
      ]);
    });

    it('should preserve hasSlices: false from object config', () => {
      const config: LayersConfig = [
        { name: 'shared', hasSlices: false },
        'features',
      ];
      const result = normalizeLayersConfig(config);

      expect(result).toEqual([
        { name: 'shared', hasSlices: false, allowSliceCrossImports: false },
        { name: 'features', hasSlices: true, allowSliceCrossImports: false },
      ]);
    });

    it('should default hasSlices to true when not specified in object', () => {
      const config: LayersConfig = [{ name: 'entities' }];
      const result = normalizeLayersConfig(config);

      expect(result).toEqual([{ name: 'entities', hasSlices: true, allowSliceCrossImports: false }]);
    });

    it('should convert layer names to lowercase', () => {
      const config: LayersConfig = ['Entities', { name: 'FEATURES' }];
      const result = normalizeLayersConfig(config);

      expect(result).toEqual([
        { name: 'entities', hasSlices: true, allowSliceCrossImports: false },
        { name: 'features', hasSlices: true, allowSliceCrossImports: false },
      ]);
    });

    it('should handle mixed config correctly', () => {
      const config: LayersConfig = [
        { name: 'shared', hasSlices: false },
        'entities',
        'features',
        'widgets',
        'pages',
        { name: 'app', hasSlices: false },
      ];
      const result = normalizeLayersConfig(config);

      expect(result).toHaveLength(6);
      expect(result[0]).toEqual({ name: 'shared', hasSlices: false, allowSliceCrossImports: false });
      expect(result[1]).toEqual({ name: 'entities', hasSlices: true, allowSliceCrossImports: false });
      expect(result[5]).toEqual({ name: 'app', hasSlices: false, allowSliceCrossImports: false });
    });

    it('should handle custom layers', () => {
      const config: LayersConfig = [
        { name: 'core', hasSlices: false },
        'domain',
        'application',
        { name: 'infrastructure', hasSlices: false },
      ];
      const result = normalizeLayersConfig(config);

      expect(result).toEqual([
        { name: 'core', hasSlices: false, allowSliceCrossImports: false },
        { name: 'domain', hasSlices: true, allowSliceCrossImports: false },
        { name: 'application', hasSlices: true, allowSliceCrossImports: false },
        { name: 'infrastructure', hasSlices: false, allowSliceCrossImports: false },
      ]);
    });

    it('should ignore allowSliceCrossImports when hasSlices is false', () => {
      const config: LayersConfig = [
        { name: 'shared', hasSlices: false, allowSliceCrossImports: true },
        { name: 'modules', hasSlices: true, allowSliceCrossImports: true },
      ];
      const result = normalizeLayersConfig(config);

      expect(result).toEqual([
        { name: 'shared', hasSlices: false, allowSliceCrossImports: false },
        { name: 'modules', hasSlices: true, allowSliceCrossImports: true },
      ]);
    });
  });

  describe('getLayerNames', () => {
    it('should return array of layer names', () => {
      const config: NormalizedLayerConfig[] = [
        { name: 'shared', hasSlices: false, allowSliceCrossImports: false },
        { name: 'entities', hasSlices: true, allowSliceCrossImports: false },
      ];

      expect(getLayerNames(config)).toEqual(['shared', 'entities']);
    });

    it('should return empty array for empty config', () => {
      expect(getLayerNames([])).toEqual([]);
    });
  });

  describe('getLayersWithSlices', () => {
    it('should return only layers with hasSlices: true', () => {
      const config: NormalizedLayerConfig[] = [
        { name: 'shared', hasSlices: false, allowSliceCrossImports: false },
        { name: 'entities', hasSlices: true, allowSliceCrossImports: false },
        { name: 'features', hasSlices: true, allowSliceCrossImports: false },
        { name: 'app', hasSlices: false, allowSliceCrossImports: false },
      ];

      expect(getLayersWithSlices(config)).toEqual(['entities', 'features']);
    });

    it('should return empty array if no layers with slices', () => {
      const config: NormalizedLayerConfig[] = [
        { name: 'shared', hasSlices: false, allowSliceCrossImports: false },
        { name: 'app', hasSlices: false, allowSliceCrossImports: false },
      ];

      expect(getLayersWithSlices(config)).toEqual([]);
    });
  });

  describe('getLayersWithoutSlices', () => {
    it('should return only layers with hasSlices: false', () => {
      const config: NormalizedLayerConfig[] = [
        { name: 'shared', hasSlices: false, allowSliceCrossImports: false },
        { name: 'entities', hasSlices: true, allowSliceCrossImports: false },
        { name: 'app', hasSlices: false, allowSliceCrossImports: false },
      ];

      expect(getLayersWithoutSlices(config)).toEqual(['shared', 'app']);
    });

    it('should return empty array if all layers have slices', () => {
      const config: NormalizedLayerConfig[] = [
        { name: 'entities', hasSlices: true, allowSliceCrossImports: false },
        { name: 'features', hasSlices: true, allowSliceCrossImports: false },
      ];

      expect(getLayersWithoutSlices(config)).toEqual([]);
    });
  });

  describe('isKnownLayer', () => {
    const config: NormalizedLayerConfig[] = [
      { name: 'shared', hasSlices: false, allowSliceCrossImports: false },
      { name: 'entities', hasSlices: true, allowSliceCrossImports: false },
      { name: 'features', hasSlices: true, allowSliceCrossImports: false },
    ];

    it('should return true for known layer', () => {
      expect(isKnownLayer('shared', config)).toBe(true);
      expect(isKnownLayer('entities', config)).toBe(true);
    });

    it('should return true for known layer with different case', () => {
      expect(isKnownLayer('SHARED', config)).toBe(true);
      expect(isKnownLayer('Entities', config)).toBe(true);
    });

    it('should return false for unknown layer', () => {
      expect(isKnownLayer('widgets', config)).toBe(false);
      expect(isKnownLayer('unknown', config)).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(isKnownLayer(null, config)).toBe(false);
      expect(isKnownLayer(undefined, config)).toBe(false);
      expect(isKnownLayer(123, config)).toBe(false);
      expect(isKnownLayer({ name: 'shared' }, config)).toBe(false);
    });
  });

  describe('getLayerWeight', () => {
    const config: NormalizedLayerConfig[] = [
      { name: 'shared', hasSlices: false, allowSliceCrossImports: false },
      { name: 'entities', hasSlices: true, allowSliceCrossImports: false },
      { name: 'features', hasSlices: true, allowSliceCrossImports: false },
      { name: 'app', hasSlices: false, allowSliceCrossImports: false },
    ];

    it('should return correct weight for each layer', () => {
      expect(getLayerWeight('shared', config)).toBe(0);
      expect(getLayerWeight('entities', config)).toBe(1);
      expect(getLayerWeight('features', config)).toBe(2);
      expect(getLayerWeight('app', config)).toBe(3);
    });

    it('should handle case-insensitive lookup', () => {
      expect(getLayerWeight('SHARED', config)).toBe(0);
      expect(getLayerWeight('Entities', config)).toBe(1);
    });

    it('should return -1 for unknown layer', () => {
      expect(getLayerWeight('unknown', config)).toBe(-1);
    });

    it('should maintain correct order (lower layer has lower weight)', () => {
      expect(getLayerWeight('shared', config)).toBeLessThan(getLayerWeight('entities', config));
      expect(getLayerWeight('entities', config)).toBeLessThan(getLayerWeight('features', config));
      expect(getLayerWeight('features', config)).toBeLessThan(getLayerWeight('app', config));
    });
  });

  describe('canLayerContainSlices', () => {
    const config: NormalizedLayerConfig[] = [
      { name: 'shared', hasSlices: false, allowSliceCrossImports: false },
      { name: 'entities', hasSlices: true, allowSliceCrossImports: false },
      { name: 'features', hasSlices: true, allowSliceCrossImports: false },
      { name: 'app', hasSlices: false, allowSliceCrossImports: false },
    ];

    it('should return true for layers with slices', () => {
      expect(canLayerContainSlices('entities', config)).toBe(true);
      expect(canLayerContainSlices('features', config)).toBe(true);
    });

    it('should return false for layers without slices', () => {
      expect(canLayerContainSlices('shared', config)).toBe(false);
      expect(canLayerContainSlices('app', config)).toBe(false);
    });

    it('should handle case-insensitive lookup', () => {
      expect(canLayerContainSlices('ENTITIES', config)).toBe(true);
      expect(canLayerContainSlices('Shared', config)).toBe(false);
    });

    it('should return false for unknown layer', () => {
      expect(canLayerContainSlices('unknown', config)).toBe(false);
    });
  });

  describe('canLayerAllowSliceCrossImports', () => {
    const config: NormalizedLayerConfig[] = [
      { name: 'shared', hasSlices: false, allowSliceCrossImports: false },
      { name: 'modules', hasSlices: true, allowSliceCrossImports: true },
      { name: 'features', hasSlices: true, allowSliceCrossImports: false },
      { name: 'app', hasSlices: false, allowSliceCrossImports: false },
    ];

    it('should return true for layers with allowSliceCrossImports: true', () => {
      expect(canLayerAllowSliceCrossImports('modules', config)).toBe(true);
    });

    it('should return false for layers with allowSliceCrossImports: false', () => {
      expect(canLayerAllowSliceCrossImports('shared', config)).toBe(false);
      expect(canLayerAllowSliceCrossImports('features', config)).toBe(false);
      expect(canLayerAllowSliceCrossImports('app', config)).toBe(false);
    });

    it('should handle case-insensitive lookup', () => {
      expect(canLayerAllowSliceCrossImports('MODULES', config)).toBe(true);
      expect(canLayerAllowSliceCrossImports('Modules', config)).toBe(true);
    });

    it('should return false for unknown layer', () => {
      expect(canLayerAllowSliceCrossImports('unknown', config)).toBe(false);
    });
  });

  describe('default layers config', () => {
    it('should have correct default FSD layers', () => {
      const normalized = normalizeLayersConfig(DEFAULT_LAYERS_CONFIG);
      const names = getLayerNames(normalized);

      expect(names).toEqual([
        'shared',
        'entities',
        'features',
        'widgets',
        'pages',
        'processes',
        'app',
      ]);
    });

    it('should have shared and app without slices', () => {
      const normalized = normalizeLayersConfig(DEFAULT_LAYERS_CONFIG);
      const withoutSlices = getLayersWithoutSlices(normalized);

      expect(withoutSlices).toEqual(['shared', 'app']);
    });

    it('should have entities, features, widgets, pages, processes with slices', () => {
      const normalized = normalizeLayersConfig(DEFAULT_LAYERS_CONFIG);
      const withSlices = getLayersWithSlices(normalized);

      expect(withSlices).toEqual([
        'entities',
        'features',
        'widgets',
        'pages',
        'processes',
      ]);
    });
  });
});
