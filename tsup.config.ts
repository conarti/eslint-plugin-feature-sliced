import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  shims: true,
  /*
   * Keeps the `export = createPlugin` declaration in dist/index.d.cts.
   * The runtime part of this transform is skipped by tsup because src/index.ts
   * also has named exports, so the CJS bundle is fixed up by the footer below.
   */
  cjsInterop: true,
  /*
   * Single entry, no dynamic imports: splitting has nothing to split.
   * Kept off so the CJS footer below can only ever land in dist/index.cjs.
   */
  splitting: false,
  esbuildOptions(options, context) {
    if (context.format === 'cjs') {
      /*
       * Makes `require('@conarti/eslint-plugin-feature-sliced')` return the
       * createPlugin function itself with every named export attached to it,
       * so the runtime shape matches the `export =` type declaration.
       */
      options.footer = {
        js: 'module.exports = Object.assign(module.exports.default, module.exports);',
      };
    }
  },
});
