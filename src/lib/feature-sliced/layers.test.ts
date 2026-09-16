import {
  canLayerContainSlices,
  getLayerWeight,
  isLayer,
} from './layers';

describe('layers', () => {
  describe('isLayer', () => {
    it('should recognize default layers when config is omitted', () => {
      expect(isLayer('entities')).toBe(true);
      expect(isLayer('unknown-layer')).toBe(false);
    });
  });

  describe('getLayerWeight', () => {
    it('should return the default layer position when config is omitted', () => {
      /* Weight is the index in the default layer order, where shared is 0 and entities follows it */
      expect(getLayerWeight('shared')).toBe(0);
      expect(getLayerWeight('entities')).toBe(1);
    });
  });

  describe('canLayerContainSlices', () => {
    it('should read hasSlices from the default config when config is omitted', () => {
      expect(canLayerContainSlices('entities')).toBe(true);
      expect(canLayerContainSlices('shared')).toBe(false);
    });
  });
});
