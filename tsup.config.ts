import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  shims: true,
  cjsInterop: true,
  splitting: true,
});
