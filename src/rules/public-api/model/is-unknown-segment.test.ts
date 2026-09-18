import type { ImportExportNodesWithSourceValue } from '../../../lib/rule';
import type { RuleContext } from '../config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makePublicApiOptions } from '../../../../tests/utils';
import { DEFAULT_SEGMENTS } from '../../../config';
import { normalizeLayersConfig } from '../../../lib/feature-sliced/layers-config';
import { VALIDATION_LEVEL } from '../config';
import { isUnknownSegment } from './is-unknown-segment';

/*
 * These boundaries cannot be reached through a RuleTester case because the rule always
 * resolves layersConfig and segmentsConfig to a concrete value (defaulted in
 * extractLayersConfig / extractSegmentsConfig) before calling isUnknownSegment, so the
 * "omitted" branches inside this module are only reachable by calling the exported
 * function directly with those arguments left out.
 */

function createMockNode(sourcePath: string): ImportExportNodesWithSourceValue {
  return { source: { value: sourcePath } } as ImportExportNodesWithSourceValue;
}

function createMockContext(filename: string): RuleContext {
  return {
    physicalFilename: filename,
    filename,
    getPhysicalFilename: () => filename,
    getFilename: () => filename,
  } as unknown as RuleContext;
}

const segmentsOptions = makePublicApiOptions({ level: VALIDATION_LEVEL.SEGMENTS });
const context = createMockContext('/test/project/src/pages/home/ui.tsx');

describe('isUnknownSegment', () => {
  describe('layer boundary', () => {
    it('should return null when no layer is present at all', () => {
      const node = createMockNode('unknownlayer/orders/weird');

      expect(isUnknownSegment(node, context, segmentsOptions)).toBeNull();
    });

    it('should extract a potential segment when exactly two parts follow the layer', () => {
      const node = createMockNode('entities/orders/weird');

      expect(isUnknownSegment(node, context, segmentsOptions)).toBe('weird');
    });

    it('should return null when only one part follows the layer', () => {
      const node = createMockNode('entities/orders');

      expect(isUnknownSegment(node, context, segmentsOptions)).toBeNull();
    });
  });

  it('should return null when every part after the layer is a group folder', () => {
    const node = createMockNode('entities/(group-a)/(group-b)');

    expect(isUnknownSegment(node, context, segmentsOptions)).toBeNull();
  });

  describe('layersConfig argument', () => {
    const customLayers = normalizeLayersConfig(['shared', 'domain', 'features']);

    it('should not recognize a custom layer name when layersConfig is omitted', () => {
      const node = createMockNode('domain/orders/weird');

      expect(isUnknownSegment(node, context, segmentsOptions)).toBeNull();
    });

    it('should recognize a custom layer name when layersConfig is provided', () => {
      const node = createMockNode('domain/orders/weird');

      expect(isUnknownSegment(node, context, segmentsOptions, customLayers)).toBe('weird');
    });
  });

  describe('segmentsConfig argument', () => {
    it('should accept a default segment reached through a group folder when segmentsConfig is omitted', () => {
      const node = createMockNode('entities/(admin)/orders/model');

      expect(isUnknownSegment(node, context, segmentsOptions, undefined, undefined)).toBeNull();
    });
  });
  /*
   * The filesystem route. The fixture project is a real tree, so a context carrying its root
   * as the cwd makes the slice boundary resolvable and the segment positional.
   */
  describe('a segment named by the filesystem resolver', () => {
    const fixtureRoot = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../../../tests/fixtures/basic-project',
    );

    const resolvedContext = {
      ...createMockContext(`${fixtureRoot}/src2/features/payment/ui/x.ts`),
      cwd: fixtureRoot,
    } as unknown as RuleContext;

    it('reports a positional segment whose name is not a configured one', () => {
      const node = createMockNode('src2/entities/invoice/helpers/invoice-helper');

      expect(isUnknownSegment(node, resolvedContext, segmentsOptions)).toBe('helpers');
    });

    it('accepts a positional segment whose name is a configured one', () => {
      const node = createMockNode('src2/entities/invoice/services/invoice-service');

      expect(isUnknownSegment(
        node,
        resolvedContext,
        segmentsOptions,
        undefined,
        [...DEFAULT_SEGMENTS, 'services'],
      )).toBeNull();
    });
  });
});
