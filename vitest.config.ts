import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    open: false,
    globals: true,
    coverage: {
      provider: 'v8',
      enabled: true,
      include: ['**/src/**'],
      exclude: ['**/src/lib/rule/models.ts', '**/tests/fixtures/**'],
      all: true,
      clean: true,
      cleanOnRerun: true,
      reporter: ['html'],
    },
  },
});
