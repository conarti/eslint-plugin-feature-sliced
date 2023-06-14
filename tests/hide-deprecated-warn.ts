/* TODO: remove this after update '@typescript-eslint/utils' for typescript 5+ */
export function hideDeprecatedWarn() {
  const originalWarn = console.warn.bind(console.warn);

  beforeAll(() => {
    console.warn = (msg) => !msg.toString().includes('originalKeywordKind') && originalWarn(msg);
  });

  afterAll(() => {
    console.warn = originalWarn;
  });
}
