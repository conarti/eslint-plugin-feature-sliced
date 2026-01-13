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
      ignorePatterns: ['**/src/legacy/**/*'],
      ignoreInFilesPatterns: ['**/tests/**/*'],
    },

    absoluteRelative: {
      ignorePatterns: ['**/mocks/**/*'],
      ignoreInFilesPatterns: [],
    },

    publicApi: {
      level: 'segments',
      ignorePatterns: [],
      ignoreInFilesPatterns: [],
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

## Options Reference

### layersSlices

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowTypeImports` | `boolean` | `true` | Allow type-only imports from any layer |
| `ignorePatterns` | `string[]` | `[]` | Glob patterns for import paths to ignore |
| `ignoreInFilesPatterns` | `string[]` | `[]` | Glob patterns for files where rule is disabled |

### absoluteRelative

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ignorePatterns` | `string[]` | `[]` | Glob patterns for import paths to ignore |
| `ignoreInFilesPatterns` | `string[]` | `[]` | Glob patterns for files where rule is disabled |

### publicApi

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `level` | `'slices'` \| `'segments'` | `'slices'` | Validation depth level |
| `ignorePatterns` | `string[]` | `[]` | Glob patterns for import paths to ignore |
| `ignoreInFilesPatterns` | `string[]` | `[]` | Glob patterns for files where rule is disabled |

### sortImports

| Value | Description |
|-------|-------------|
| `'recommended'` | Default sorting without newlines between groups |
| `'with-newlines'` | Add empty lines between import groups |
| `'with-type-group'` | Separate group for type imports |
| `'with-newlines-and-type-group'` | Newlines + type group |
| `false` | Disable import sorting |

## Pattern Matching

All `ignorePatterns` and `ignoreInFilesPatterns` options use glob patterns powered by [picomatch](https://github.com/micromatch/picomatch).

::: warning Note
The plugin reads the full file path from the system root. Always start patterns with `**` to match paths correctly.
:::

```js
featureSliced({
  layersSlices: {
    ignorePatterns: [
      '**/src/legacy/**/*',
      '@/shared/deprecated/*',
    ],
    ignoreInFilesPatterns: [
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
