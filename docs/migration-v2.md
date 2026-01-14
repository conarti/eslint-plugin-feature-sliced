# Migration from v1 to v2

This guide covers migrating from `@conarti/eslint-plugin-feature-sliced` v1.x to v2.0.

## Overview

Version 2.0 is a major release that:

- Drops support for ESLint 8.x
- Uses ESLint 9 Flat Config exclusively
- Updates to `eslint-plugin-import-x` instead of `eslint-plugin-import`
- Improves TypeScript support
- Adds new configuration options

## Requirements

- **Node.js**: >= 18.0.0
- **ESLint**: >= 9.0.0

## Breaking Changes

### 1. ESLint 9 Required

v2.0 only supports ESLint 9 with Flat Config. If you're using ESLint 8.x, you'll need to upgrade ESLint first.

```bash
npm install eslint@^9.0.0
```

### 2. Configuration Format Changed

v1.x used the legacy `.eslintrc` format:

```json
// .eslintrc.json (v1.x - OLD)
{
  "plugins": ["@conarti/feature-sliced"],
  "rules": {
    "@conarti/feature-sliced/layers-slices": "error",
    "@conarti/feature-sliced/absolute-relative": "error",
    "@conarti/feature-sliced/public-api": "error"
  }
}
```

v2.0 uses ESLint 9 Flat Config:

```js
// eslint.config.js (v2.0 - NEW)
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced(),
];
```

### 3. Plugin Function Instead of Extending

v2.0 exports a function that returns a flat config array:

```js
// v1.x - OLD
export default {
  plugins: ['@conarti/feature-sliced'],
  extends: ['plugin:@conarti/feature-sliced/recommended'],
};

// v2.0 - NEW
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced(),
];
```

### 4. import-order Uses import-x

The import sorting now uses `eslint-plugin-import-x` (an ESLint 9 compatible fork) instead of `eslint-plugin-import`.

If you have custom `import/order` configurations, you may need to adjust them for `import-x/order`.

## Step-by-Step Migration

### Step 1: Upgrade Dependencies

```bash
npm uninstall @conarti/eslint-plugin-feature-sliced
npm install -D @conarti/eslint-plugin-feature-sliced@^2.0.0 eslint@^9.0.0
```

### Step 2: Create eslint.config.js

Create a new `eslint.config.js` file:

```js
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced(),
];
```

### Step 3: Remove Old Config

Delete old configuration files:
- `.eslintrc`
- `.eslintrc.js`
- `.eslintrc.json`
- `.eslintrc.yaml`

### Step 4: Update Scripts

If you have npm scripts using `--ext`, update them:

```json
// Before
"lint": "eslint --ext .js,.ts,.tsx src/"

// After
"lint": "eslint src/"
```

### Step 5: Migrate Custom Options

If you had custom rule options in v1.x:

```json
// v1.x - OLD
{
  "rules": {
    "@conarti/feature-sliced/layers-slices": ["error", {
      "allowTypeImports": true
    }],
    "@conarti/feature-sliced/public-api": ["error", {
      "level": "segments"
    }]
  }
}
```

Convert them to the new format:

```js
// v2.0 - NEW
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    layersSlices: {
      allowTypeImports: true,
    },
    publicApi: {
      level: 'segments',
    },
  }),
];
```

## New Features in v2.0

### Disable Individual Rules

You can now disable rules by setting them to `false`:

```js
featureSliced({
  absoluteRelative: false,
  sortImports: false,
});
```

### New ignorePatterns Options

All rules now support `ignorePatterns` and `ignoreInFilesPatterns`:

```js
featureSliced({
  layersSlices: {
    ignorePatterns: ['**/legacy/**/*'],
    ignoreInFilesPatterns: ['**/*.test.ts'],
  },
});
```

### Multiple Import Sort Configurations

New sorting options:
- `recommended` (default)
- `with-newlines`
- `with-type-group`
- `with-newlines-and-type-group`

```js
featureSliced({
  sortImports: 'with-newlines-and-type-group',
});
```

## Troubleshooting

### "ESLint couldn't find the plugin"

Make sure you're using ESLint 9 and have the correct import:

```js
// Correct
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

// Incorrect
const featureSliced = require('@conarti/eslint-plugin-feature-sliced');
```

### "Config must be an array"

The plugin function returns an array, don't wrap it:

```js
// Correct
export default [
  featureSliced(),
];

// Incorrect
export default [
  [featureSliced()],
];
```

### import/order conflicts

If you see conflicts with import sorting, disable the built-in sorting:

```js
featureSliced({
  sortImports: false,
});
```

## Need Help?

If you encounter issues during migration:

1. Check the [GitHub Issues](https://github.com/conarti/eslint-plugin-feature-sliced/issues)
2. Open a new issue with your configuration and error messages
