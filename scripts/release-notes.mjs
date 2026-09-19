import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * @description
 * semantic-release `generateNotes` plugin that prefers hand written notes.
 * When `.github/releases/<version>.md` exists, its content becomes the release
 * body verbatim, so a release can ship reviewed prose instead of a dump of every
 * commit subject. The file is named after the exact version semantic-release
 * computed, without a `v` prefix, for example `.github/releases/2.0.0.md`.
 * When no such file exists the notes fall back to the default
 * conventional-changelog output of the release notes generator plugin, which
 * keeps ordinary patch and minor releases fully automatic.
 */

/**
 * @description
 * Curated notes may reserve a section whose content only the release gate can
 * produce, by leaving a marker where that content belongs, as the 2.1.0 notes
 * do with `MEASURED-DELTAS-PLACEHOLDER` over the measured effect section. A
 * marker is the word `PLACEHOLDER` in upper case, optionally prefixed with
 * upper case words joined by hyphens, so one convention covers the marker this
 * release needs and any later one without a list to keep in step. Ordinary
 * prose is untouched: the word in lower or mixed case is not a marker, and
 * neither is the sequence inside a longer word.
 */
const PLACEHOLDER_MARKER = /\b(?:[A-Z0-9]+-)*PLACEHOLDER\b/g;

async function readCuratedNotes(notesPath) {
  try {
    return await fs.readFile(notesPath, 'utf8');
  }
  catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }

    throw error;
  }
}

/* Each distinct marker once, at the line it first appears on. */
function findPlaceholderMarkers(content) {
  const firstSeen = new Map();

  content.split('\n').forEach((line, index) => {
    for (const [marker] of line.matchAll(PLACEHOLDER_MARKER)) {
      if (!firstSeen.has(marker)) {
        firstSeen.set(marker, index + 1);
      }
    }
  });

  return [...firstSeen].map(([marker, line]) => `  line ${line}: ${marker}`);
}

export async function generateNotes(pluginConfig, context) {
  const notesPath = path.join(context.cwd, '.github', 'releases', `${context.nextRelease.version}.md`);
  const curatedNotes = await readCuratedNotes(notesPath);

  if (curatedNotes !== null) {
    context.logger.log('Using curated release notes from %s', notesPath);

    const markers = findPlaceholderMarkers(curatedNotes);

    /* The release body is published verbatim and cannot be corrected in place
     * afterwards, so an unresolved marker aborts the release instead of
     * shipping a section that tells readers the content was withheld. */
    if (markers.length > 0) {
      const message = [
        `Refusing to publish ${notesPath}: the curated release notes still carry an unresolved marker.`,
        ...markers,
        'Replace each marker with the content it stands for, then run the release again.',
      ].join('\n');

      context.logger.error(message);

      throw new Error(message);
    }

    return `${curatedNotes.trim()}\n`;
  }

  context.logger.log('No curated release notes at %s, generating them from the commit history', notesPath);

  const { generateNotes: generateDefaultNotes } = await import('@semantic-release/release-notes-generator');

  return generateDefaultNotes(pluginConfig, context);
}
