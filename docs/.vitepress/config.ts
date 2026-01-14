import { defineConfig } from 'vitepress';

const GITHUB_REPO = 'https://github.com/conarti/eslint-plugin-feature-sliced';

export default defineConfig({
  title: 'eslint-plugin-feature-sliced',
  description: 'ESLint plugin for Feature-Sliced Design methodology',

  srcDir: '../',
  srcExclude: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/tests/**'],

  rewrites: {
    'docs/index.md': 'index.md',
    'docs/getting-started.md': 'getting-started.md',
    'docs/configuration.md': 'configuration.md',
    'docs/migration-v2.md': 'migration-v2.md',
    'docs/rules/index.md': 'rules/index.md',
    'docs/ru/:path*': 'ru/:path*',
    'src/rules/:rule/README.md': 'rules/:rule.md',
    'src/rules/:rule/README.ru.md': 'ru/rules/:rule.md',
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/getting-started' },
          { text: 'Rules', link: '/rules/' },
          { text: 'Migration', link: '/migration-v2' },
        ],
        sidebar: {
          '/': [
            {
              text: 'Introduction',
              items: [
                { text: 'Getting Started', link: '/getting-started' },
                { text: 'Configuration', link: '/configuration' },
              ],
            },
            {
              text: 'Rules',
              items: [
                { text: 'Overview', link: '/rules/' },
                { text: 'layers-slices', link: '/rules/layers-slices' },
                { text: 'absolute-relative', link: '/rules/absolute-relative' },
                { text: 'public-api', link: '/rules/public-api' },
                { text: 'import-order', link: '/rules/import-order' },
              ],
            },
            {
              text: 'Migration',
              items: [
                { text: 'v1 to v2', link: '/migration-v2' },
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
                { text: 'layers-slices', link: '/ru/rules/layers-slices' },
                { text: 'absolute-relative', link: '/ru/rules/absolute-relative' },
                { text: 'public-api', link: '/ru/rules/public-api' },
                { text: 'import-order', link: '/ru/rules/import-order' },
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
