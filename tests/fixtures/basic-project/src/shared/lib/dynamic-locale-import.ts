export function loadLocale(locale: string): Promise<unknown> {
  return import(`./locales/${locale}.json`);
}
