import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { describe, expect, it } from 'vitest';
import { generateNotes } from '../../scripts/release-notes.mjs';

/* The token the 2.1.0 notes carry over the section the release gate fills in. */
const MEASURED_DELTAS_TOKEN = 'MEASURED-DELTAS-PLACEHOLDER';

/* A curated file lives at .github/releases/<version>.md under the release cwd.
 * Each case gets its own cwd so the cases cannot read one another's files. */
async function curatedRelease(version, body) {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'release-notes-'));

  if (body !== null) {
    await fs.mkdir(path.join(cwd, '.github', 'releases'), { recursive: true });
    await fs.writeFile(path.join(cwd, '.github', 'releases', `${version}.md`), body);
  }

  return cwd;
}

function releaseContext(cwd, version) {
  const logged = [];

  return {
    logged,
    cwd,
    nextRelease: { version },
    logger: {
      log: (...args) => logged.push(['log', ...args]),
      error: (...args) => logged.push(['error', ...args]),
    },
  };
}

async function generate(version, body) {
  const cwd = await curatedRelease(version, body);

  return { context: releaseContext(cwd, version), cwd };
}

describe('release notes', () => {
  describe('an unresolved placeholder', () => {
    it('refuses a curated file that still carries the 2.1.0 token', async () => {
      const { context } = await generate('2.1.0', `## Measured effect\n\n> **${MEASURED_DELTAS_TOKEN}. Filled in by the release gate.**\n`);

      await expect(generateNotes({}, context)).rejects.toThrow(MEASURED_DELTAS_TOKEN);
    });

    it('names the curated file, the marker and the line it sits on', async () => {
      const { context, cwd } = await generate('2.1.0', `a first line\n\n> ${MEASURED_DELTAS_TOKEN} here\n`);
      const notesPath = path.join(cwd, '.github', 'releases', '2.1.0.md');

      const error = await generateNotes({}, context).catch((thrown) => thrown);

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toContain(notesPath);
      expect(error.message).toContain(MEASURED_DELTAS_TOKEN);
      expect(error.message).toContain('line 3');
    });

    it('says what to do about it', async () => {
      const { context } = await generate('2.1.0', `${MEASURED_DELTAS_TOKEN}\n`);

      const error = await generateNotes({}, context).catch((thrown) => thrown);

      expect(error.message).toMatch(/replace|resolve/i);
    });

    it('puts the refusal in the operator log as well as in the error', async () => {
      const { context } = await generate('2.1.0', `${MEASURED_DELTAS_TOKEN}\n`);

      await generateNotes({}, context).catch(() => undefined);

      const errors = context.logged.filter(([level]) => level === 'error');

      expect(errors).not.toHaveLength(0);
      expect(errors.flat().join(' ')).toContain(MEASURED_DELTAS_TOKEN);
    });

    it.each([
      ['a bare upper case marker', 'PLACEHOLDER'],
      ['another prefixed marker', 'BENCHMARK-NUMBERS-PLACEHOLDER'],
      ['a digit bearing prefix', 'V2-PLACEHOLDER'],
    ])('refuses %s, so the next unresolved section is caught too', async (_name, marker) => {
      const { context } = await generate('2.1.0', `the numbers go here: ${marker}\n`);

      await expect(generateNotes({}, context)).rejects.toThrow(marker);
    });

    it('lists every distinct marker it found, once each, in order', async () => {
      const { context } = await generate('2.1.0', `${MEASURED_DELTAS_TOKEN}\nCOUNTS-PLACEHOLDER\n${MEASURED_DELTAS_TOKEN}\n`);

      const error = await generateNotes({}, context).catch((thrown) => thrown);
      const markers = error.message.match(/[A-Z0-9-]*PLACEHOLDER/g);

      expect(markers).toEqual([MEASURED_DELTAS_TOKEN, 'COUNTS-PLACEHOLDER']);
    });
  });

  describe('prose that is not a marker', () => {
    it.each([
      ['lower case prose', 'this release replaces the placeholder numbers with measured ones.'],
      ['a mixed case word', 'The Placeholder section is gone.'],
      ['an upper case word that only ends in the letters', 'the REPLACEHOLDERS list is unrelated.'],
    ])('passes %s through', async (_name, body) => {
      const { context } = await generate('2.1.0', `${body}\n`);

      await expect(generateNotes({}, context)).resolves.toBe(`${body}\n`);
    });
  });

  describe('a resolved curated file', () => {
    it('returns the 2.0.1 notes byte identical, apart from the single trailing newline', async () => {
      const shipped = await fs.readFile(path.join(process.cwd(), '.github', 'releases', '2.0.1.md'), 'utf8');
      const { context } = await generate('2.0.1', shipped);

      const body = await generateNotes({}, context);

      expect(body).toBe(`${shipped.trim()}\n`);
      expect(body.trim()).toBe(shipped.trim());
    });

    it('does not touch a body that has no marker in it', async () => {
      const body = '## What changed\n\nOne fix, no numbers withheld.\n';
      const { context } = await generate('2.0.1', body);

      await expect(generateNotes({}, context)).resolves.toBe(body);
    });

    it('still reports which curated file it used', async () => {
      const { context, cwd } = await generate('2.0.1', 'clean notes\n');

      await generateNotes({}, context);

      expect(context.logged.flat().join(' ')).toContain(path.join(cwd, '.github', 'releases', '2.0.1.md'));
    });
  });

  describe('no curated file', () => {
    it('falls back to the commit history rather than refusing', async () => {
      const { context } = await generate('2.0.2', null);

      context.commits = [];
      context.lastRelease = { version: '2.0.1', gitTag: 'v2.0.1' };
      context.nextRelease.gitTag = 'v2.0.2';
      context.nextRelease.type = 'patch';
      context.options = { repositoryUrl: 'https://github.com/conarti/eslint-plugin-feature-sliced.git' };

      await expect(generateNotes({}, context)).resolves.toBeTypeOf('string');
    });
  });
});
