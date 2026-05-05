import type { UnknownRuleContext } from './models';
import { DEFAULT_SEGMENTS, PLUGIN_NAME } from '../../config';
import { extractSegmentsConfig } from './extract-segments-config';

function createMockContext(settings?: Record<string, unknown>): UnknownRuleContext {
  return {
    settings: settings ?? {},
  } as unknown as UnknownRuleContext;
}

describe('extractSegmentsConfig', () => {
  it('should return default segments when no settings provided', () => {
    const context = createMockContext();
    const result = extractSegmentsConfig(context);

    expect(result).toEqual([...DEFAULT_SEGMENTS]);
  });

  it('should return default segments when plugin settings are empty', () => {
    const context = createMockContext({
      [PLUGIN_NAME]: {},
    });
    const result = extractSegmentsConfig(context);

    expect(result).toEqual([...DEFAULT_SEGMENTS]);
  });

  it('should extend defaults when array provided (extend mode)', () => {
    const context = createMockContext({
      [PLUGIN_NAME]: {
        segments: ['services', 'hooks'],
      },
    });

    const result = extractSegmentsConfig(context);
    expect(result).toEqual([...DEFAULT_SEGMENTS, 'services', 'hooks']);
  });

  it('should replace defaults when object with replace provided', () => {
    const context = createMockContext({
      [PLUGIN_NAME]: {
        segments: { replace: ['ui', 'services'] },
      },
    });

    const result = extractSegmentsConfig(context);
    expect(result).toEqual(['ui', 'services']);
  });

  it('should return default segments when segments is invalid type', () => {
    const context = createMockContext({
      [PLUGIN_NAME]: {
        segments: 'not-valid',
      },
    });

    const result = extractSegmentsConfig(context);
    expect(result).toEqual([...DEFAULT_SEGMENTS]);
  });

  it('should return default segments when settings is undefined', () => {
    const context = { settings: undefined } as unknown as UnknownRuleContext;
    const result = extractSegmentsConfig(context);

    expect(result).toEqual([...DEFAULT_SEGMENTS]);
  });

  it('should handle settings without plugin key', () => {
    const context = createMockContext({
      someOtherPlugin: { foo: 'bar' },
    });

    const result = extractSegmentsConfig(context);
    expect(result).toEqual([...DEFAULT_SEGMENTS]);
  });

  it('should convert segment names to lowercase', () => {
    const context = createMockContext({
      [PLUGIN_NAME]: {
        segments: ['Services', 'HOOKS'],
      },
    });

    const result = extractSegmentsConfig(context);
    expect(result).toContain('services');
    expect(result).toContain('hooks');
  });

  it('should handle object replace with lowercase conversion', () => {
    const context = createMockContext({
      [PLUGIN_NAME]: {
        segments: { replace: ['UI', 'Model'] },
      },
    });

    const result = extractSegmentsConfig(context);
    expect(result).toEqual(['ui', 'model']);
  });

  it('should handle empty array in extend mode', () => {
    const context = createMockContext({
      [PLUGIN_NAME]: {
        segments: [],
      },
    });

    const result = extractSegmentsConfig(context);
    expect(result).toEqual([...DEFAULT_SEGMENTS]);
  });

  it('should handle empty array in replace mode', () => {
    const context = createMockContext({
      [PLUGIN_NAME]: {
        segments: { replace: [] },
      },
    });

    const result = extractSegmentsConfig(context);
    expect(result).toEqual([]);
  });
});
