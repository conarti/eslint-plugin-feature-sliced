# Configuration

## Basic Configuration

For simple use with default settings:

```js
// eslint.config.js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced(),
];
```

## Advanced Configuration

You can customize each rule individually:

```js
// eslint.config.js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    layersSlices: {
      allowTypeImports: true,
      ignoreImports: ['**/src/legacy/**/*'],
      ignoreFiles: ['**/tests/**/*'],
    },

    absoluteRelative: {
      ignoreImports: ['**/mocks/**/*'],
      ignoreFiles: [],
    },

    publicApi: {
      level: 'segments',
      ignoreImports: [],
      ignoreFiles: [],
    },

    sortImports: 'with-newlines',
  }),
];
```

## Disabling Rules

To disable a specific rule, set it to `false`:

```js
// eslint.config.js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    absoluteRelative: false,
    sortImports: false,
  }),
];
```

## Custom Layers

You can define custom layers to match your project structure. This is useful when:
- You use non-standard FSD layers
- You have additional custom layers
- You need to change which layers can contain slices

### Configuration

The `layers` option accepts an array of layer configurations:

```js
// eslint.config.js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    layers: [
      { name: 'shared', hasSlices: false },
      'entities',
      'features',
      'widgets',
      'pages',
      { name: 'app', hasSlices: false },
    ],
  }),
];
```

### Layer Configuration Types

Each layer can be configured as:

- **String** - Layer name with `hasSlices: true` (default)
- **Object** - Layer with explicit `hasSlices` setting

```ts
type LayerConfigItem =
  | string
  | { name: string; hasSlices?: boolean };
```

### The `hasSlices` Property

The `hasSlices` property determines whether a layer can contain slices:

- `true` (default) - Layer can contain slices (e.g., `entities`, `features`)
- `false` - Layer cannot contain slices (e.g., `shared`, `app`)

This affects rule behavior:
- **layers-slices**: Layers without slices don't enforce slice isolation
- **absolute-relative**: Imports within layers without slices should be relative
- **import-order**: Sorting groups are generated based on layer configuration

### Examples

**Standard FSD with processes layer removed:**

```js
featureSliced({
  layers: [
    { name: 'shared', hasSlices: false },
    'entities',
    'features',
    'widgets',
    'pages',
    { name: 'app', hasSlices: false },
  ],
});
```

**Custom layers:**

```js
featureSliced({
  layers: [
    { name: 'core', hasSlices: false },
    'domain',
    'features',
    'pages',
    { name: 'app', hasSlices: false },
  ],
});
```

**All layers with slices:**

```js
featureSliced({
  layers: ['shared', 'entities', 'features', 'widgets', 'pages', 'app'],
});
```

## Options Reference

### layersSlices

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowTypeImports` | `boolean` | `true` | Allow type-only imports from any layer |
| `ignoreImports` | `string[]` | `[]` | Glob patterns for import paths to ignore |
| `ignoreFiles` | `string[]` | `[]` | Glob patterns for files where rule is disabled |

### absoluteRelative

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ignoreImports` | `string[]` | `[]` | Glob patterns for import paths to ignore |
| `ignoreFiles` | `string[]` | `[]` | Glob patterns for files where rule is disabled |

### publicApi

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `level` | `'slices'` \| `'segments'` | `'slices'` | Validation depth level |
| `ignoreImports` | `string[]` | `[]` | Glob patterns for import paths to ignore |
| `ignoreFiles` | `string[]` | `[]` | Glob patterns for files where rule is disabled |

### sortImports

| Value | Description |
|-------|-------------|
| `'recommended'` | Default sorting without newlines between groups |
| `'with-newlines'` | Add empty lines between import groups |
| `'with-type-group'` | Separate group for type imports |
| `'with-newlines-and-type-group'` | Newlines + type group |
| `false` | Disable import sorting |

## Pattern Matching

All `ignoreImports` and `ignoreFiles` options use glob patterns powered by [picomatch](https://github.com/micromatch/picomatch).

::: warning Note
The plugin reads the full file path from the system root. Always start patterns with `**` to match paths correctly.
:::

```js
featureSliced({
  layersSlices: {
    ignoreImports: [
      '**/src/legacy/**/*',
      '@/shared/deprecated/*',
    ],
    ignoreFiles: [
      '**/tests/**/*',
      '**/*.test.ts',
      '**/*.spec.ts',
    ],
  },
});
```

## Using with Other Configs

The plugin returns a flat config array, so you can combine it with other configs:

```js
// eslint.config.js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended,
  featureSliced(),
  {
    rules: {
      // your custom rules
    },
  },
];
```
