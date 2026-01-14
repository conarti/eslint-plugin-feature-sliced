import { layers, layersWithoutSlices } from '../../config';
import {
  canLayerContainSlices,
  getLayerWeight,
  isLayer,
} from './layers';

describe('layers', () => {
  describe('isLayer', () => {
    describe('valid layers', () => {
      const cases = layers.map((layer) => ({
        name: `should return true for "${layer}"`,
        input: layer,
        expected: true,
      }));

      it.each(cases)('$name', ({ input, expected }) => {
        expect(isLayer(input)).toBe(expected);
      });
    });

    describe('invalid inputs', () => {
      const cases = [
        {
          name: 'should return false for unknown layer',
          input: 'unknown',
          expected: false,
        },
        {
          name: 'should return false for null',
          input: null,
          expected: false,
        },
        {
          name: 'should return false for undefined',
          input: undefined,
          expected: false,
        },
        {
          name: 'should return false for number',
          input: 123,
          expected: false,
        },
        {
          name: 'should return false for empty string',
          input: '',
          expected: false,
        },
        {
          name: 'should return false for object',
          input: { name: 'shared' },
          expected: false,
        },
        {
          name: 'should return false for array',
          input: ['shared'],
          expected: false,
        },
        {
          name: 'should return true for layer with different case (case-insensitive)',
          input: 'SHARED',
          expected: true,
        },
        {
          name: 'should return false for layer with prefix',
          input: 'my-shared',
          expected: false,
        },
        {
          name: 'should return false for layer with suffix',
          input: 'shared-layer',
          expected: false,
        },
      ];

      it.each(cases)('$name', ({ input, expected }) => {
        expect(isLayer(input)).toBe(expected);
      });
    });
  });

  describe('getLayerWeight', () => {
    const cases = layers.map((layer, index) => ({
      name: `should return ${index} for "${layer}"`,
      input: layer,
      expected: index,
    }));

    it.each(cases)('$name', ({ input, expected }) => {
      expect(getLayerWeight(input)).toBe(expected);
    });

    it('should return lower weight for shared than entities', () => {
      expect(getLayerWeight('shared')).toBeLessThan(getLayerWeight('entities'));
    });

    it('should return lower weight for entities than features', () => {
      expect(getLayerWeight('entities')).toBeLessThan(getLayerWeight('features'));
    });

    it('should return lower weight for features than app', () => {
      expect(getLayerWeight('features')).toBeLessThan(getLayerWeight('app'));
    });
  });

  describe('canLayerContainSlices', () => {
    describe('layers without slices', () => {
      const cases = layersWithoutSlices.map((layer) => ({
        name: `should return false for "${layer}"`,
        input: layer,
        expected: false,
      }));

      it.each(cases)('$name', ({ input, expected }) => {
        expect(canLayerContainSlices(input)).toBe(expected);
      });
    });

    describe('layers with slices', () => {
      const layersWithSlices = layers.filter(
        (layer) => !layersWithoutSlices.includes(layer),
      );

      const cases = layersWithSlices.map((layer) => ({
        name: `should return true for "${layer}"`,
        input: layer,
        expected: true,
      }));

      it.each(cases)('$name', ({ input, expected }) => {
        expect(canLayerContainSlices(input)).toBe(expected);
      });
    });
  });
});
