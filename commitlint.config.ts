/*
 * commitlint stays on 19.x. From @commitlint/read 20.4.4 on, the git reader pulls
 * a package that declares optional peer dependencies, and npm 10 and npm 11 record
 * those differently in the lockfile. CI installs with both, so a lockfile written
 * by one of them fails `npm ci` on the other. 21.x also requires Node 22.12 or
 * newer, while the hook has to run on every Node version this package supports.
 */
import isIgnored from '@commitlint/is-ignored';

interface ParsedCommit {
  header?: string | null;
  body?: string | null;
  footer?: string | null;
}

type RuleOutcome = [valid: boolean, message: string];

const SCISSORS_LINE = /^#\s*-+\s*>8\s*-+\s*$/;
const ATTRIBUTION_LINE = [
  /^\W*co-authored-by:/im,
  /^\W*generated with\b/im,
];

/*
 * The parser hands over the authored message split in three. With `--edit` it has
 * already dropped the git comment lines. In every other mode those lines stay, so
 * a line starting with a hash counts. Two things are dropped in every mode: the
 * text below a literal scissors line and lines starting with `gpg:`.
 */
function readAuthored(parsed: ParsedCommit) {
  return [parsed.header, parsed.body, parsed.footer].filter(Boolean).join('\n');
}

/*
 * The ignore decision is the one place that sees the raw edit file, so it has to
 * drop the hook noise itself before judging the message.
 */
function stripHookNoise(raw: string) {
  const lines = raw.split('\n');
  const scissorsIndex = lines.findIndex((line) => SCISSORS_LINE.test(line));
  const authored = scissorsIndex === -1 ? lines : lines.slice(0, scissorsIndex);

  return authored.filter((line) => !line.startsWith('#')).join('\n');
}

function findNonAsciiCodePoints(message: string) {
  const found: string[] = [];

  for (const character of message) {
    const codePoint = character.codePointAt(0) ?? 0;

    if (codePoint < 128) {
      continue;
    }

    const formatted = `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`;

    if (!found.includes(formatted)) {
      found.push(formatted);
    }
  }

  return found;
}

function hasAttributionLine(message: string) {
  return ATTRIBUTION_LINE.some((pattern) => pattern.test(message));
}

function messageAsciiOnly(parsed: ParsedCommit): RuleOutcome {
  const found = findNonAsciiCodePoints(readAuthored(parsed));

  return [
    found.length === 0,
    `message must contain only ascii characters, found: ${found.join(', ')}`,
  ];
}

function messageNoAttributionLines(parsed: ParsedCommit): RuleOutcome {
  return [
    !hasAttributionLine(readAuthored(parsed)),
    'message must not carry attribution lines, drop any "Co-authored-by:" trailer and any line starting with "Generated with"',
  ];
}

/*
 * Merges, reverts and fixups are written by git, so the conventional rules cannot
 * apply to them. They still have to be readable, so they only get a pass while
 * they hold nothing the two local rules would reject.
 */
function isCleanDefaultShape(raw: string) {
  const authored = stripHookNoise(raw);

  return isIgnored(authored)
    && findNonAsciiCodePoints(authored).length === 0
    && !hasAttributionLine(authored);
}

export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'message-ascii-only': messageAsciiOnly,
        'message-no-attribution-lines': messageNoAttributionLines,
      },
    },
  ],
  defaultIgnores: false,
  ignores: [isCleanDefaultShape],
  rules: {
    /* Bodies here carry tables, urls and tool output, so line length is not a useful signal. */
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
    'message-ascii-only': [2, 'always'],
    'message-no-attribution-lines': [2, 'always'],
  },
};
