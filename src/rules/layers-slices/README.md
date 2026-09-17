# Check layers and slices imports (`@conarti/feature-sliced/layers-slices`)

This rule is aimed at checking the compliance of layer and slice imports by methodology.

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

Disables the rule for type imports. This setting is enabled by default. Both `import type { ... }` and inline `import { type ... }` specifiers are exempt; in an import that mixes type and value named specifiers, only the value ones are reported.

```typescript
import type { FooType } from 'app/config' // filename: src/entities/bar/model.tsx, no error
import { type FooType } from 'app/config' // filename: src/entities/bar/model.tsx, no error
import { type FooType, foo } from 'app/config' // filename: src/entities/bar/model.tsx, error on foo only
import { FooType } from 'app/config' // filename: src/entities/bar/model.tsx, error
```

Known gap: a default import combined with inline type specifiers only, such as `import config, { type FooType } from 'app/config'`, is not reported at all. See [issue #38](https://github.com/conarti/eslint-plugin-feature-sliced/issues/38).

Recommended to be used in conjunction with the `@typescript-eslint/no-restricted-imports` rule 
and the `allowTypeImports: true` setting.
https://typescript-eslint.io/rules/no-restricted-imports/#allowtypeimports

`ignoreImports`

Array of patterns to ignore validation for certain import paths (matched against the import path as written in code).

Example settings:

```json
{
  "@conarti/feature-sliced/layers-slices": ["error", {
    "ignoreImports": ["**/foo", "@/entities/bar"]
  }]
}
```

This example setting will ignore such paths:
```typescript
import { Bar } from '@/entities/bar'; // filename: src/shared/ui/baz, no error
import { Foo } from 'src/entities/foo'; // filename: src/shared/ui/baz, no error
```

`ignoreFiles`

Array of patterns to disable the rule for certain files or folders (matched against the file being linted).

Example settings:

```json
{
  "@conarti/feature-sliced/layers-slices": ["error", {
    "ignoreFiles": ["**/src/components/**/*"]
  }]
}
```

```typescript
// filename: src/components/Foo/index.ts, no error regardless of the import
import { Bar } from 'entities/bar';
```

Please note that the plugin reads the entire file path from the root of your system, not the project.
That's why patterns for `ignoreFiles` should start with `**`.

## When Not To Use It

Disable this rule if you are just migrating to fsd. Or set it to display warnings instead of errors.
You can also specify settings to ignore certain paths during migration.
In other situations, it is recommended to use this rule always.

## Further Reading

https://fsd.how/docs/reference/layers/
