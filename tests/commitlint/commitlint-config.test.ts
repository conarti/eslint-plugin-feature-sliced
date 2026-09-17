import config from '../../commitlint.config';

const localRules = config.plugins[0].rules;
const asciiOnly = localRules['message-ascii-only'];
const noAttributionLines = localRules['message-no-attribution-lines'];
const [isIgnorable] = config.ignores;

const TRAILER = 'Co-authored-by: Someone <someone@example.com>';
const SCISSORS = '# ------------------------ >8 ------------------------';

/* Mirrors what the parser hands a rule: the authored fields, plus the untouched raw input. */
function parsed(header: string, body: string | null = null, footer: string | null = null) {
  return {
    raw: [header, body, footer].filter(Boolean).join('\n\n'),
    header,
    body,
    footer,
  };
}

describe('commitlint config', () => {
  describe('wiring', () => {
    it('extends the conventional config', () => {
      expect(config.extends).toEqual(['@commitlint/config-conventional']);
    });

    it('turns the default ignores into a decision of its own', () => {
      expect(config.defaultIgnores).toBe(false);
      expect(config.ignores).toHaveLength(1);
      expect(isIgnorable).toBeTypeOf('function');
    });

    it.each([
      'message-ascii-only',
      'message-no-attribution-lines',
    ] as const)('enables %s as an error', (ruleName) => {
      expect(config.rules[ruleName][0]).toBe(2);
    });

    it.each([
      'body-max-line-length',
      'footer-max-line-length',
    ] as const)('disables %s', (ruleName) => {
      expect(config.rules[ruleName][0]).toBe(0);
    });

    it.each([
      'message-ascii-only',
      'message-no-attribution-lines',
    ] as const)('registers %s in the local plugin', (ruleName) => {
      expect(localRules[ruleName]).toBeTypeOf('function');
    });
  });

  describe('message-ascii-only', () => {
    it('accepts a plain ascii message', () => {
      expect(asciiOnly(parsed('feat(scope): add a thing', 'the body stays ascii.'))).toEqual([true, expect.any(String)]);
    });

    it.each([
      ['cyrillic', 'fix: \u043F\u0440\u0430\u0432\u043A\u0430', 'U+043F'],
      ['a long dash', 'fix: drop the flag \u2014 it never worked', 'U+2014'],
      ['an emoji', 'feat: ship it \u{1F680}', 'U+1F680'],
      ['an arrow', 'refactor: move a \u2192 b', 'U+2192'],
    ])('rejects %s in the header', (_name, header, codePoint) => {
      const [valid, message] = asciiOnly(parsed(header));

      expect(valid).toBe(false);
      expect(message).toContain(`found: ${codePoint}`);
    });

    it('rejects a long dash in the body', () => {
      expect(asciiOnly(parsed('fix: tidy up', 'the flag \u2014 never worked'))[0]).toBe(false);
    });

    it('rejects a long dash in the footer', () => {
      expect(asciiOnly(parsed('fix: tidy up', 'a body', 'BREAKING CHANGE: it \u2014 broke'))[0]).toBe(false);
    });

    it('counts lines that start with a hash, which survive a real commit', () => {
      expect(asciiOnly(parsed('chore: tidy up', '## Summary \u2014'))[0]).toBe(false);
    });

    it('lists every offending code point once, in order of appearance', () => {
      expect(asciiOnly(parsed('fix: \u2014 \u043F \u2014'))).toEqual([
        false,
        'message must contain only ascii characters, found: U+2014, U+043F',
      ]);
    });

    it('reads the parsed fields and not the raw input', () => {
      const commit = { ...parsed('fix: a clean header'), raw: 'fix: a raw header \u2014' };

      expect(asciiOnly(commit)[0]).toBe(true);
    });
  });

  describe('message-no-attribution-lines', () => {
    it('accepts a message without attribution lines', () => {
      expect(noAttributionLines(parsed('feat: add a thing', 'plain body.'))[0]).toBe(true);
    });

    it.each([
      ['the plain trailer', TRAILER],
      ['a lower case trailer', 'co-authored-by: someone <someone@example.com>'],
      ['an upper case trailer', 'CO-AUTHORED-BY: SOMEONE <someone@example.com>'],
      ['a space indented trailer', `  ${TRAILER}`],
      ['a tab indented trailer', `\t${TRAILER}`],
      ['a quoted trailer', `> ${TRAILER}`],
      ['a hash prefixed trailer', `#${TRAILER}`],
    ])('rejects %s', (_name, line) => {
      const [valid, message] = noAttributionLines(parsed('feat: add a thing', line));

      expect(valid).toBe(false);
      expect(message).toBeTypeOf('string');
    });

    it.each([
      ['a bare line', 'Generated with some tool'],
      ['a decorated line', '* Generated with some tool'],
      ['an emoji prefixed line', '\u{1F916} Generated with some tool'],
      ['a lower case line', 'generated with some tool'],
    ])('rejects %s starting with the attribution phrase', (_name, line) => {
      expect(noAttributionLines(parsed('feat: add a thing', line))[0]).toBe(false);
    });

    it.each([
      ['the trailer', TRAILER],
      ['the attribution phrase', 'Generated with some tool'],
    ])('rejects %s after a carriage return line ending', (_name, line) => {
      expect(noAttributionLines(parsed('feat: add a thing', `a first line\r\n${line}`))[0]).toBe(false);
    });

    it('rejects a trailer in the footer', () => {
      expect(noAttributionLines(parsed('feat: add a thing', 'a body', TRAILER))[0]).toBe(false);
    });

    it('accepts the phrase in the middle of a sentence', () => {
      expect(noAttributionLines(parsed('chore: refresh the lockfile', 'the lockfile was generated with npm 11.'))[0]).toBe(true);
    });

    it('reads the parsed fields and not the raw input', () => {
      const commit = { ...parsed('feat: add a thing'), raw: `feat: add a thing\n\n${TRAILER}` };

      expect(noAttributionLines(commit)[0]).toBe(true);
    });
  });

  describe('ignores', () => {
    it.each([
      ['a revert', 'Revert "feat: add a thing"'],
      ['a fixup', 'fixup! feat: add a thing'],
      ['a squash', 'squash! feat: add a thing'],
      ['a branch merge', 'Merge branch \'master\' into topic'],
      ['a pull request merge', 'Merge pull request #12 from conarti/topic'],
      ['a version bump', '2.0.1'],
    ])('lets %s through when it is clean', (_name, raw) => {
      expect(isIgnorable(raw)).toBe(true);
    });

    it.each([
      ['an attribution trailer', `Revert "feat: add a thing"\n\n${TRAILER}`],
      ['a long dash', 'Revert "feat: drop the flag \u2014 it never worked"'],
      ['cyrillic', 'Revert "fix: \u043F\u0440\u0430\u0432\u043A\u0430"'],
    ])('still checks a default shape carrying %s', (_name, raw) => {
      expect(isIgnorable(raw)).toBe(false);
    });

    it('leaves an ordinary message to the rules', () => {
      expect(isIgnorable('feat: add a thing')).toBe(false);
    });

    it('ignores comment lines and the scissors section, which only the hook sees', () => {
      const raw = [
        'Revert "feat: add a thing"',
        '',
        '# \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435',
        SCISSORS,
        'diff --git a/readme.md b/readme.md',
        '-the dash \u2014 lived here',
      ].join('\n');

      expect(isIgnorable(raw)).toBe(true);
    });

    it('sees an attribution trailer that a hook comment cannot hide', () => {
      const raw = ['Revert "feat: add a thing"', '', TRAILER, '# a trailing comment'].join('\n');

      expect(isIgnorable(raw)).toBe(false);
    });
  });
});
