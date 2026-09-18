import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  hasPublicApi,
  isPublicApiFileName,
} from './has-public-api';

describe('has-public-api', () => {
  let root: string;

  beforeAll(() => {
    root = mkdtempSync(path.join(tmpdir(), 'feature-sliced-public-api-'));
  });

  afterAll(() => {
    rmSync(root, { recursive: true, force: true });
  });

  function makeDirectory(name: string, files: string[] = []): string {
    const directory = path.join(root, name);
    mkdirSync(directory, { recursive: true });
    files.forEach((file) => writeFileSync(path.join(directory, file), '', 'utf8'));
    return directory;
  }

  describe('isPublicApiFileName', () => {
    const publicApiFiles = [
      'index.ts',
      'index.tsx',
      'index.js',
      'index.jsx',
      'index.mjs',
      'index.cjs',
      'index.mts',
      'index.cts',
      'index.vue',
      'index.svelte',
      'INDEX.TS',
    ];

    it.each(publicApiFiles)('accepts "%s"', (fileName) => {
      expect(isPublicApiFileName(fileName)).toBe(true);
    });

    const otherFiles = [
      'index.d.ts',
      'index.test.ts',
      'index.spec.tsx',
      'index.module.css',
      'index.css',
      'index.html',
      'index.md',
      'index',
      'index.',
      'indexed.ts',
      'my-index.ts',
      'model.ts',
    ];

    it.each(otherFiles)('rejects "%s"', (fileName) => {
      expect(isPublicApiFileName(fileName)).toBe(false);
    });
  });

  describe('hasPublicApi', () => {
    it('answers true for a directory holding a source index file', () => {
      expect(hasPublicApi(makeDirectory('with-barrel', ['index.ts', 'thing.ts']))).toBe(true);
    });

    it('answers false for a directory holding only a declaration index file', () => {
      expect(hasPublicApi(makeDirectory('declaration-only', ['index.d.ts']))).toBe(false);
    });

    it('answers false for a directory holding only a colocated index test file', () => {
      expect(hasPublicApi(makeDirectory('test-only', ['index.test.ts']))).toBe(false);
    });

    it('answers false for a directory holding only a non source index file', () => {
      expect(hasPublicApi(makeDirectory('style-only', ['index.module.css', 'index.html']))).toBe(false);
    });

    it('answers false when the index entry is a directory rather than a file', () => {
      const directory = makeDirectory('index-directory');
      mkdirSync(path.join(directory, 'index.ts'));
      expect(hasPublicApi(directory)).toBe(false);
    });

    it('answers false for a directory that does not exist', () => {
      expect(hasPublicApi(path.join(root, 'nowhere'))).toBe(false);
    });

    it('answers from the cache, so a public api file added later is not seen', () => {
      const directory = makeDirectory('cached');

      expect(hasPublicApi(directory)).toBe(false);

      writeFileSync(path.join(directory, 'index.ts'), '', 'utf8');

      expect(hasPublicApi(directory)).toBe(false);
    });
  });
});
