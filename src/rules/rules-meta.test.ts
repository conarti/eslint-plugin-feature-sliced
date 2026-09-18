import rules from './index';

const ruleCases = [
  {
    ruleName: 'absolute-relative',
    rule: rules['absolute-relative'],
    type: 'problem',
    description: 'Checks for absolute and relative paths',
    messages: {
      'must-be-relative-path': 'There must be relative paths',
      'must-be-absolute-path': 'There must be absolute paths',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignoreImports: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          ignoreFiles: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    ],
    defaultOptions: [
      {
        ignoreImports: [],
        ignoreFiles: [],
      },
    ],
    hasSuggestions: undefined,
  },
  {
    ruleName: 'layers-slices',
    rule: rules['layers-slices'],
    type: 'problem',
    description: 'Checks layer imports',
    messages: {
      'can-not-import': 'You cannot import layer "{{ importLayer }}" into "{{ currentFileLayer }}" ({{ layersOrder }})',
      'invalid-cross-import': 'Cross-import "{{ sourceSlice }}/@x/{{ targetSlice }}" is only allowed from slice "{{ targetSlice }}"',
      'pass-through-reexport': 'Re-export from layer "{{ importLayer }}" forwards it through "{{ currentFileLayer }}", import it directly instead',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowTypeImports: {
            type: 'boolean',
          },
          allowPassThroughReexports: {
            type: 'boolean',
          },
          ignoreImports: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          ignoreFiles: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    ],
    defaultOptions: [
      {
        allowTypeImports: true,
        allowPassThroughReexports: false,
        ignoreImports: [],
        ignoreFiles: [],
      },
    ],
    hasSuggestions: undefined,
  },
  {
    ruleName: 'no-cross-segment-reexport',
    rule: rules['no-cross-segment-reexport'],
    type: 'problem',
    description: 'Checks for cross-segment re-exports within the same slice',
    messages: {
      'no-cross-segment-reexport':
        'Segment "{{ currentSegment }}" should not re-export from sibling segment "{{ targetSegment }}". Move the re-export to the slice public API.',
      'move-to-slice-public-api-suggestion': 'Replace import path with slice public API ("{{ suggestedPath }}")',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignoreImports: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          ignoreFiles: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    ],
    defaultOptions: [
      {
        ignoreImports: [],
        ignoreFiles: [],
      },
    ],
    hasSuggestions: true,
  },
  {
    ruleName: 'public-api',
    rule: rules['public-api'],
    type: 'problem',
    description: 'Check for module imports from public api',
    messages: {
      'should-be-from-public-api': 'Absolute imports are only allowed from public api ("{{ fixedPath }}")',
      'remove-suggestion': 'Remove the "{{ valueToRemove }}"',
      'layers-public-api-not-allowed': 'The layer public API is not allowed. It harms both architecturally and practically (code splitting)',
      'unknown-segment': 'Unknown segment "{{ segment }}". Add it to segments configuration or use the public API.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          level: {
            type: 'string',
            enum: [
              'segments',
              'slices',
            ],
          },
          ignoreImports: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          ignoreFiles: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    ],
    defaultOptions: [
      {
        level: 'slices',
        ignoreImports: [],
        ignoreFiles: [],
      },
    ],
    hasSuggestions: true,
  },
];

describe.each(ruleCases)('$ruleName meta', ({ ruleName, rule, type, description, messages, schema, defaultOptions, hasSuggestions }) => {
  it('pins name', () => {
    expect(rule.name).toBe(ruleName);
  });

  it('pins meta.type', () => {
    expect(rule.meta.type).toBe(type);
  });

  it('pins meta.docs.description', () => {
    expect(rule.meta.docs?.description).toBe(description);
  });

  it('pins meta.messages', () => {
    expect(rule.meta.messages).toStrictEqual(messages);
  });

  it('pins meta.schema', () => {
    expect(rule.meta.schema).toStrictEqual(schema);
  });

  it('pins defaultOptions', () => {
    expect(rule.defaultOptions).toStrictEqual(defaultOptions);
  });

  it('pins meta.hasSuggestions', () => {
    expect(rule.meta.hasSuggestions).toBe(hasSuggestions);
  });
});
