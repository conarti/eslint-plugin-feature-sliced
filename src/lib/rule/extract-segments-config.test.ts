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

describe('segments settings validation table', () => {
  interface SegmentsValidationCase {
    name: string;
    segments: unknown;
    expected: string[];
  }

  /* Literal copy of DEFAULT_SEGMENTS from src/config.ts, kept independent of the module under test. */
  const DEFAULT_SEGMENTS_LITERAL = ['ui', 'model', 'lib', 'api', 'config', 'assets'];

  const cases: SegmentsValidationCase[] = [
    {
      name: 'array of strings extends the defaults',
      segments: ['services'],
      expected: [...DEFAULT_SEGMENTS_LITERAL, 'services'],
    },
    {
      name: 'array with a non-string item is rejected and normalizes to defaults',
      segments: [1, 'services'],
      expected: DEFAULT_SEGMENTS_LITERAL,
    },
    {
      name: 'replace object with a valid string array replaces the defaults exactly',
      segments: { replace: ['ui', 'model'] },
      expected: ['ui', 'model'],
    },
    {
      name: 'replace object with a non-array replace value is rejected and normalizes to defaults',
      segments: { replace: 'ui' },
      expected: DEFAULT_SEGMENTS_LITERAL,
    },
    {
      name: 'replace object with an array containing a non-string is rejected and normalizes to defaults',
      segments: { replace: [1] },
      expected: DEFAULT_SEGMENTS_LITERAL,
    },
    {
      name: 'object without a replace key is rejected and normalizes to defaults',
      segments: { other: ['ui'] },
      expected: DEFAULT_SEGMENTS_LITERAL,
    },
    {
      name: 'null is rejected and normalizes to defaults',
      segments: null,
      expected: DEFAULT_SEGMENTS_LITERAL,
    },
    {
      name: 'plain string is rejected and normalizes to defaults',
      segments: 'services',
      expected: DEFAULT_SEGMENTS_LITERAL,
    },
    {
      name: 'number is rejected and normalizes to defaults',
      segments: 42,
      expected: DEFAULT_SEGMENTS_LITERAL,
    },
  ];

  it.each(cases)('$name', ({ segments, expected }) => {
    const context = createMockContext({
      [PLUGIN_NAME]: { segments },
    });

    const result = extractSegmentsConfig(context);
    expect(result).toEqual(expected);
  });
});
