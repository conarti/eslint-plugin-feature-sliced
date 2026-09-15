import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    open: false,
    globals: true,
    coverage: {
      provider: 'v8',
      enabled: true,
      include: ['src/**/*.ts'],
      exclude: ['src/lib/rule/models.ts'],
      clean: true,
      cleanOnRerun: true,
      reporter: ['html'],
    },
  },
});
