# Claude Code Guidelines for eslint-plugin-feature-sliced

## Language

- **Commits**: English only
- **Pull requests**: English only (title and description)
- **Code comments**: English only (JSDoc and inline comments)

## Git Workflow

### Branch naming
```
<type>/<description>
```

Examples:
- `feat/add-x-cross-imports`
- `fix/extract-slice-group-folders`

### Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`

## Testing

- Use TDD approach for new features
- Run `npm test` before committing
- Run `npm run lint` and `npm run type-check`

## Project Structure

```
src/
├── config.ts           # FSD layers, segments configuration
├── lib/
│   ├── feature-sliced/ # FSD-specific utilities (extractSlice, extractLayer, etc.)
│   ├── path/           # Path manipulation utilities
│   ├── rule/           # ESLint rule utilities
│   └── shared/         # Shared utilities
├── rules/
│   ├── layers-slices/  # Cross-layer import validation
│   ├── public-api/     # Public API enforcement
│   ├── absolute-relative/ # Import path style
│   └── import-order/   # Import sorting
└── configs/            # Preset configurations
```
