import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: 'Feature Sliced Eslint Plugin',
	description: 'Feature Sliced Design Eslint Plugin Docs',
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{
				text: 'Home',
				link: '/',
			},
			{
				text: 'Examples',
				link: '/markdown-examples',
			},
		],

		sidebar: [
			{
				text: 'Examples',
				items: [
					{
						text: 'Markdown Examples',
						link: '/markdown-examples',
					},
					{
						text: 'Runtime API Examples',
						link: '/api-examples',
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
					svg: '<svg xmlns="http://www.w3.org/2000/svg" aria-label="npm" role="img" viewBox="0 0 512 512"><rectwidth="512" height="512"rx="15%"fill="#fff"/><path fill="none" stroke="#cb3837" stroke-width="22" d="m234 311h213v-112H65v112h113V210m-12 123h90M133 232v68m112-68v45m45-67v90m67-68v68m45-68v68"/></svg>'
				},
				link: 'https://www.npmjs.com/package/eslint-plugin-conarti-fsd',
			},
		],

		search: {
			provider: 'local',
		},
	},
});
