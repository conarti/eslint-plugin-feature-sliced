import {
  canLayerContainSlices,
  getLayerWeight,
  isLayer,
} from './layers';
import { normalizeLayersConfig } from './layers-config';

describe('layers', () => {
  describe('isLayer', () => {
    it('should fall back to normalizeLayersConfig() when config is omitted', () => {
      expect(isLayer('entities')).toBe(isLayer('entities', normalizeLayersConfig()));
    });
  });

  describe('getLayerWeight', () => {
    it('should fall back to normalizeLayersConfig() when config is omitted', () => {
      expect(getLayerWeight('entities')).toBe(getLayerWeight('entities', normalizeLayersConfig()));
    });
  });

  describe('canLayerContainSlices', () => {
    it('should fall back to normalizeLayersConfig() when config is omitted', () => {
      expect(canLayerContainSlices('entities')).toBe(canLayerContainSlices('entities', normalizeLayersConfig()));
    });
  });
});
