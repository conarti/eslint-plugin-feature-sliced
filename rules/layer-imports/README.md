# Checks layer imports (`conarti-fsd/layer-imports`)

This rule is aimed at checking the compliance of layer imports by methodology.

## Rule Details

Examples of **incorrect** code for this rule:

```js
import { Bar } from 'entities/bar' // filename: src/entities/baz/ui.tsx 
import { FooType } from 'app/config' // filename: src/entities/bar/model.tsx 
```

Examples of **correct** code for this rule:

```js
import { Baz } from 'shared/bar'; // filename: src/shared/ui/foo
import { AppRouter } from 'app/providers/router'; // filename: src/app/App.tsx
import { Foo } from '@/entities/foo' // filename: src/features/bar/ui.tsx 
```

### Options

`allowTypeImports: true`

Disables the rule for type imports. This setting is included in the 'recommended' config.

```typescript
import type { FooType } from 'app/config' // filename: src/entities/bar/model.tsx
// Attention! Doesn't work if the type was imported like this. You should always use 'type' prefix
import { FooType } from 'app/config' // filename: src/entities/bar/model.tsx - still ERROR
```

## When Not To Use It

Disable this rule if you are just migrating to fsd. Or set it to display warnings instead of errors (default behavior).
In other situations, it is recommended to use this rule always.

## Further Reading

https://feature-sliced.design/docs/reference/units/layers
