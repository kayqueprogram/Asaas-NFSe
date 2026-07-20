import path from 'path';
import { defineUserConfig } from 'vuepress-vite';
import type { DefaultThemeOptions, ViteBundlerOptions } from 'vuepress-vite';
import sidebar from './sidebar';
import { searchPlugin } from '@vuepress/plugin-search';

const config = defineUserConfig<DefaultThemeOptions, ViteBundlerOptions>({
	bundler: '@vuepress/vite',
	templateDev: path.join(__dirname, 'templates', 'index.dev.html'),
	templateSSR: path.join(__dirname, 'templates', 'index.ssr.html'),
	lang: 'pt-BR',
	title: 'Asaas NFSe',
	description: 'Guia prático para integração e emissão de Notas Fiscais de Serviço (NFSe) usando a API do Asaas.',
	head: [
		['meta', { charset: 'utf-8' }],
		['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
		['meta', { name: 'theme-color', content: '#003057' }],
		['meta', { name: 'twitter:card', content: 'summary' }],
		['meta', { property: 'og:title', content: 'Asaas API - Emissão de NFSe' }],
		['meta', { property: 'og:description', content: 'Guia prático para integração e emissão de Notas Fiscais de Serviço (NFSe) usando a API do Asaas.' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:url', content: 'https://docs.asaas.com/' }],
		['meta', { property: 'og:locale', content: 'pt_BR' }],
		['meta', { property: 'og:image', content: '/meta-image.png' }],
	],
	theme: '@vuepress/theme-default',
	themeConfig: {
		contributors: false,
		sidebar,
		repo: 'kayqueprogram/Asaas-NFSe',
		docsBranch: 'main',
		docsDir: 'guide',
		sidebarDepth: 3,
		editLink: true,
		editLinkText: 'Editar esta página',
		lastUpdated: true,
		navbar: [
			{
				text: 'API Asaas',
				link: 'https://docs.asaas.com/',
			},
		],
		themePlugins: {
			mediumZoom: false,
		},
	},
	plugins: [
		searchPlugin({
			locales: {
				'/': {
					placeholder: 'Pesquisar...',
				},
			},
		}),
	],
});

const { ALGOLIA_DOCSEARCH_API_KEY, ALGOLIA_DOCSEARCH_APP_ID, GOOGLE_ANALYTICS_ID, NODE_ENV } = process.env;

if (NODE_ENV === 'production' && ALGOLIA_DOCSEARCH_API_KEY && GOOGLE_ANALYTICS_ID) {
	config.plugins.push(
		[
			'@vuepress/plugin-docsearch',
			{
				appId: ALGOLIA_DOCSEARCH_APP_ID,
				apiKey: ALGOLIA_DOCSEARCH_API_KEY,
				indexName: 'discordjs',
				placeholder: 'Search guide',
			},
		],
		[
			'@vuepress/plugin-google-analytics',
			{ id: GOOGLE_ANALYTICS_ID },
		],
	);
}

export default config;
