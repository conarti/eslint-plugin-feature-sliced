# Rules Overview

The plugin provides 4 rules to enforce Feature-Sliced Design methodology:

| Rule | Description | Fixable |
|------|-------------|---------|
| [layers-slices](./layers-slices) | Validates imports between layers according to FSD hierarchy | |
| [absolute-relative](./absolute-relative) | Ensures correct path types (relative/absolute) | |
| [public-api](./public-api) | Enforces imports from public API only | 💡 |
| [import-order](./import-order) | Sorts imports by FSD layers | 🔧 |

**Legend:**
- 🔧 Automatically fixable with `--fix`
- 💡 Has suggestion fixes

## FSD Layer Hierarchy

The rules work with the standard FSD layer hierarchy (from lowest to highest):

1. `shared` - reusable utilities, UI kit (no slices)
2. `entities` - business entities
3. `features` - user interactions
4. `widgets` - compositional layer
5. `pages` - application pages
6. `processes` - complex business processes (deprecated)
7. `app` - application initialization (no slices)

::: info
`shared` and `app` layers don't have slices - they contain modules directly.
:::

## FSD Segments

Standard segments within slices:
- `ui` - UI components
- `model` - business logic
- `lib` - utilities
- `api` - API interactions
- `config` - configuration
- `assets` - static assets
