import { defineConfig } from 'vitepress';

const GITHUB_REPO = 'https://github.com/conarti/eslint-plugin-feature-sliced';

export default defineConfig({
  title: 'eslint-plugin-feature-sliced',
  description: 'ESLint plugin for Feature-Sliced Design methodology',

  srcDir: '../',
  srcExclude: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/tests/**'],

  rewrites: {
    'docs/index.md': 'index.md',
    'docs/en/:path*': 'en/:path*',
    'docs/ru/:path*': 'ru/:path*',
    'src/rules/:rule/README.md': 'en/rules/:rule.md',
  },

  locales: {
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en/getting-started' },
          { text: 'Rules', link: '/en/rules/' },
          { text: 'Migration', link: '/en/migration-v2' },
        ],
        sidebar: {
          '/en/': [
            {
              text: 'Introduction',
              items: [
                { text: 'Getting Started', link: '/en/getting-started' },
                { text: 'Configuration', link: '/en/configuration' },
              ],
            },
            {
              text: 'Rules',
              items: [
                { text: 'Overview', link: '/en/rules/' },
                { text: 'layers-slices', link: '/en/rules/layers-slices' },
                { text: 'absolute-relative', link: '/en/rules/absolute-relative' },
                { text: 'public-api', link: '/en/rules/public-api' },
                { text: 'import-order', link: '/en/rules/import-order' },
              ],
            },
            {
              text: 'Migration',
              items: [
                { text: 'v1 to v2', link: '/en/migration-v2' },
              ],
            },
          ],
        },
      },
    },
    ru: {
      label: 'Русский',
      lang: 'ru',
      link: '/ru/',
      themeConfig: {
        nav: [
          { text: 'Руководство', link: '/ru/getting-started' },
          { text: 'Правила', link: '/ru/rules/' },
          { text: 'Миграция', link: '/ru/migration-v2' },
        ],
        sidebar: {
          '/ru/': [
            {
              text: 'Введение',
              items: [
                { text: 'Начало работы', link: '/ru/getting-started' },
                { text: 'Конфигурация', link: '/ru/configuration' },
              ],
            },
            {
              text: 'Правила',
              items: [
                { text: 'Обзор', link: '/ru/rules/' },
                { text: 'layers-slices', link: '/en/rules/layers-slices' },
                { text: 'absolute-relative', link: '/en/rules/absolute-relative' },
                { text: 'public-api', link: '/en/rules/public-api' },
                { text: 'import-order', link: '/en/rules/import-order' },
              ],
            },
            {
              text: 'Миграция',
              items: [
                { text: 'v1 на v2', link: '/ru/migration-v2' },
              ],
            },
          ],
        },
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',

    socialLinks: [
      { icon: 'github', link: GITHUB_REPO },
    ],

    footer: {
      message: 'Released under the ISC License.',
      copyright: `Copyright © ${new Date().getFullYear()} Aleksandr Belous`,
    },

    editLink: {
      pattern: `${GITHUB_REPO}/edit/master/:path`,
    },

    search: {
      provider: 'local',
    },
  },
});
