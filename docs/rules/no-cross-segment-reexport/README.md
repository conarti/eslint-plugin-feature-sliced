# @conarti/feature-sliced/no-cross-segment-reexport

💡 This rule provides [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## Rule Details

Checks for cross-segment re-exports within the same slice.

In feature-sliced design, each segment (`ui`, `model`, `api`, `lib`, etc.) within a slice should not re-export from sibling segments. Such re-exports should be placed in the slice's public API (the `index.ts` at the slice root) instead.

### ❌ Incorrect

```javascript
// file: src/entities/cluster/model/index.ts

export { fetchCluster } from '../api';         // model re-exports from api
export type { ClusterDTO } from '../api';      // type re-export from sibling segment
export * from '../api';                        // star re-export from sibling segment
export { translations } from '../i18n';        // re-export from non-standard sibling segment
```

```javascript
// file: src/entities/cluster/model/store/index.ts

export { fetchCluster } from '../../api';      // nested file re-exporting from sibling segment
```

### ✅ Correct

```javascript
// file: src/entities/cluster/index.ts (slice public API)

export { fetchCluster } from './api';          // re-export in slice public API is fine
export { clusterModel } from './model';
```

```javascript
// file: src/entities/cluster/model/index.ts

export { useCluster } from './hooks';          // same-segment internal re-export
export { clusterStore } from './store';        // same-segment internal re-export
export { foo } from 'lodash';                  // external package re-export
```

## 💡 Suggestion

When a cross-segment re-export is detected, the rule suggests replacing the import path with the slice's public API path.

```javascript
// file: src/entities/cluster/model/index.ts

export { fetchCluster } from '../api';
// suggestion: Replace import path with slice public API ("..") 
// fix: export { fetchCluster } from '..';
```

## Options

### `ignoreImports`

Array of import path patterns to ignore.

```jsonc
// eslint.config.js
{
  "rules": {
    "@conarti/feature-sliced/no-cross-segment-reexport": ["error", {
      "ignoreImports": ["../api"]
    }]
  }
}
```

### `ignoreFiles`

Array of file path patterns where the rule should be disabled.

```jsonc
// eslint.config.js
{
  "rules": {
    "@conarti/feature-sliced/no-cross-segment-reexport": ["error", {
      "ignoreFiles": ["**/model/index.ts"]
    }]
  }
}
```

## Usage with `createPlugin`

```javascript
import featureSliced from '@conarti/eslint-plugin-feature-sliced';

export default [
  featureSliced({
    noCrossSegmentReexport: {
      severity: 'error',
      ignoreImports: [],
      ignoreFiles: [],
    },
  }),
];
```

To disable the rule:

```javascript
featureSliced({
  noCrossSegmentReexport: false,
});
```
