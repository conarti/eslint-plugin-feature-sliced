import { createRequire } from 'module';
import { defineConfig } from 'vitepress';

const require = createRequire(import.meta.url)
const packageJson = require('../../package.json')

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: 'Documentation',
	description: 'feature-sliced.design Eslint Plugin Docs',
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{
				text: packageJson.version,
				items: [
					{
						text: 'Changelog',
						link: 'https://github.com/conarti/eslint-plugin-feature-sliced/blob/master/CHANGELOG.md'
					},
					// TODO 'Contributing'
				]
			}
		],

		sidebar: [
			{
				text: 'Getting Started',
				items: [
					{
						text: 'Quick install',
						link: '/quick-install',
					},
					{
						text: 'Advanced configuration',
						link: '/advanced-configuration',
					},
				],
			},
			{
				text: 'Configurations',
				items: [
					{
						text: 'recommended',
						link: '/configurations/recommended',
					},
					/*
            TODO: add the 'base' configuration that contains only plugin rules settings.
             Then create a doc page with link here.
          */
					{
						text: 'import-order',
						link: '/configurations/import-order',
					},
				],
			},
			{
				text: 'Rules',
				items: [
					{
						text: 'absolute-relative',
						link: '/rules/absolute-relative',
					},
					{
						text: 'layers-slices',
						link: '/rules/layers-slices',
					},
					{
						text: 'public-api',
						link: '/rules/public-api',
					},
				],
			},
		],

		socialLinks: [
			{
				icon: 'github',
				link: 'https://github.com/conarti/eslint-plugin-fsd',
			},
			{
				icon: {
					svg: `<svg 
									xmlns="http://www.w3.org/2000/svg"
									xmlns:xlink="http://www.w3.org/1999/xlink"
									x="0px"
									y="0px"
									viewBox="0 0 512 512" 
									style="enable-background:new 0 0 512 512;"
									xml:space="preserve"
      					>
									<g>
										<path d="M0,0v512h512V0H0z M416.1,416.1h-64.2v-256H256v256H95.9V95.9h320.2V416.1z"/>
									</g>
								</svg>`
				},
				link: 'https://www.npmjs.com/package/eslint-plugin-conarti-fsd',
			},
		],

		search: {
			provider: 'local',
		},
	},
});
