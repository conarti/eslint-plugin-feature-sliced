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

Disables the rule for type imports. This setting is enabled by default. Both `import type { ... }` and inline `import { type ... }` specifiers are exempt; in an import that mixes type and value named specifiers, only the value ones are reported. A re-export is read the same way, so `export type { ... }`, `export type * from` and inline `export { type ... }` specifiers are exempt too, and a re-export mixing type and value specifiers is reported at its value ones.

```typescript
import type { FooType } from 'app/config' // filename: src/entities/bar/model.tsx, no error
import { type FooType } from 'app/config' // filename: src/entities/bar/model.tsx, no error
import { type FooType, foo } from 'app/config' // filename: src/entities/bar/model.tsx, error on foo only
import { FooType } from 'app/config' // filename: src/entities/bar/model.tsx, error
export type { FooType } from 'app/config' // filename: src/entities/bar/model.tsx, no error
export { type FooType } from 'app/config' // filename: src/entities/bar/model.tsx, no error
export { type FooType, foo } from 'app/config' // filename: src/entities/bar/model.tsx, error on foo only
export { FooType } from 'app/config' // filename: src/entities/bar/model.tsx, error
```

Every example above re-exports an **upper** layer, which is the `can-not-import` message. The
exemption works the same way on a re-export of a **lower** layer, but there the message is
`pass-through-reexport` instead, so a project that only reads the block above never sees the
other half:

```typescript
export type { FooType } from 'shared/config' // filename: src/app/providers/index.ts, no error
export { type FooType } from 'shared/config' // filename: src/app/providers/index.ts, no error
export { type FooType, foo } from 'shared/config' // filename: src/app/providers/index.ts, pass-through-reexport on foo only
export { foo } from 'shared/config' // filename: src/app/providers/index.ts, pass-through-reexport
```

A declaration is reported once per offending value specifier, not once per declaration, so
`export { a, type A, b } from 'app/config'` produces two reports. The import spelling of the
same declaration has always behaved this way.

A default specifier is a value import, so a default combined with inline type specifiers only,
such as `import config, { type FooType } from 'app/config'`, is reported on the default
specifier. Where the declaration also carries a value named specifier, both are reported.

Recommended to be used in conjunction with the `@typescript-eslint/no-restricted-imports` rule 
and the `allowTypeImports: true` setting.
https://typescript-eslint.io/rules/no-restricted-imports/#allowtypeimports

`allowPassThroughReexports: false`

A re-export of a **lower** layer forwards that layer through the current one, so every consumer
of this file depends on the lower layer without saying so. Importing downward is legal, which is
why this is not a layer violation, but the re-export hides the real dependency. It is reported
under its own message id, `pass-through-reexport`, and the check is on by default.

```typescript
export { Button } from 'shared/ui' // filename: src/app/providers/index.ts, pass-through-reexport
export { createUser } from 'entities/user' // filename: src/widgets/nav/index.ts, pass-through-reexport
```

The message names both layers, so the second line above reports:

> Re-export from layer "entities" forwards it through "widgets", import it directly instead

Set the option to `true` if your project uses pass-through barrels deliberately. It silences
this message id only and leaves the rest of the rule alone.

```json
{
  "@conarti/feature-sliced/layers-slices": ["error", {
    "allowPassThroughReexports": true
  }]
}
```

These shapes are not pass-through re-exports and are never reported by this check:

```typescript
export { createUser } from './model/create-user' // filename: src/entities/user/index.ts, no error
export { formatDate } from '../lib/format-date' // filename: src/shared/ui/index.ts, no error
export type { Theme } from 'shared/config' // filename: src/app/providers/index.ts, no error
```

The first stays inside one slice, which is what a slice public api is made of. The second joins
two files of a layer that has no slices. The third is type-only, and type-only re-exports are
exempt under `allowTypeImports`.

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
