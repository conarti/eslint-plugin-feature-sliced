import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      enabled: true,
      include: ['**/src/**'],
      exclude: ['**/rule-lib/models.ts'],
      all: true,
      clean: true,
      cleanOnRerun: true,
      reporter: ['html'],
    },
  },
});
