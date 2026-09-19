import { readdirSync } from 'node:fs';

/**
 * A public api file is a source `index` file and nothing else. The pattern is anchored at
 * both ends, so a colocated `index.test.ts`, `index.module.css`, `index.d.ts` or `index.html`
 * never turns its folder into a slice.
 *
 * `src/rules/public-api/model/is-index-file.ts` is deliberately left alone: it is the
 * `public-api` rule's own predicate, and tightening it there would move that rule's reports.
 */
const PUBLIC_API_FILE_REGEXP = /^index\.(?:ts|tsx|js|jsx|mjs|cjs|mts|cts|vue|svelte)$/i;

export function isPublicApiFileName(fileName: string): boolean {
  return PUBLIC_API_FILE_REGEXP.test(fileName);
}

/**
 * Memoised per directory, so the number of directory reads is bounded by the number of
 * distinct directories in the project rather than by the number of imports. The cache lives
 * as long as the process, which for a lint run is the run; in a long lived editor process a
 * newly added `index.ts` is therefore not seen until the language server restarts.
 */
const publicApiByDirectory = new Map<string, boolean>();

function readPublicApi(directory: string): boolean {
  try {
    return readdirSync(directory, { withFileTypes: true })
      .some((entry) => entry.isFile() && isPublicApiFileName(entry.name));
  }
  catch {
    /* A directory that does not exist or cannot be read holds no public api */
    return false;
  }
}

/**
 * The only place in `src/` that touches the filesystem.
 *
 * Answers whether the absolute directory holds a public api file. One directory read per
 * directory, not one existence check per extension.
 */
export function hasPublicApi(directory: string): boolean {
  const cached = publicApiByDirectory.get(directory);

  if (cached !== undefined) {
    return cached;
  }

  const answer = readPublicApi(directory);
  publicApiByDirectory.set(directory, answer);

  return answer;
}
