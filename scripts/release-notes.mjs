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

export async function generateNotes(pluginConfig, context) {
  const notesPath = path.join(context.cwd, '.github', 'releases', `${context.nextRelease.version}.md`);
  const curatedNotes = await readCuratedNotes(notesPath);

  if (curatedNotes !== null) {
    context.logger.log('Using curated release notes from %s', notesPath);
    return `${curatedNotes.trim()}\n`;
  }

  context.logger.log('No curated release notes at %s, generating them from the commit history', notesPath);

  const { generateNotes: generateDefaultNotes } = await import('@semantic-release/release-notes-generator');

  return generateDefaultNotes(pluginConfig, context);
}
