# Project Guidelines

> Note: CLAUDE.md can be committed in this project (overrides global rule).

## Package Manager

This project uses **npm** (not pnpm or yarn).

```bash
npm install
npm run build
npm run test
```

## Project Structure

```
src/
├── rules/              # ESLint rules
│   ├── layers-slices/  # Layer hierarchy validation
│   ├── absolute-relative/ # Path type validation
│   ├── public-api/     # Public API enforcement
│   └── import-order/   # Import sorting configs
├── lib/                # Shared utilities
├── config.ts           # FSD layers, segments config
├── create-plugin.ts    # Plugin factory function
└── plugin.ts           # Plugin export

docs/                   # VitePress documentation
├── en/                 # English docs
└── ru/                 # Russian docs
```

## Development

```bash
npm run build          # Build plugin (tsup)
npm run test           # Run tests (vitest)
npm run lint           # Lint code
npm run docs:dev       # Start docs dev server
npm run docs:build     # Build documentation
```

## Documentation

- Documentation is bilingual (English + Russian)
- Rule READMEs are in `src/rules/*/README.md`
- VitePress site is in `docs/`
- Deploy via GitHub Actions to GitHub Pages

## Testing

Tests use `@typescript-eslint/rule-tester` with vitest.
Each rule has tests in `src/rules/*/index.test.ts`.

## Key Dependencies

- ESLint 9+ (Flat Config only)
- `eslint-plugin-import-x` for import sorting
- `picomatch` for glob pattern matching
